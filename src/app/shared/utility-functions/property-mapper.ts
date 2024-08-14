/**
 * The type of indexer (array structure)
 *
 * None ='no.indexer', Numeric 'a[4]' style, keyed 'a[datakey]' or empty 'a[]'
 *
 * @enum {number}
 */
 enum IndexerTypes { None, Numeric, Keyed, Empty }

 /**
  * PropertyMapper - Static helper call that takes a given property path as a string and an object
  * and returns the property targeted on the object by that path. This is used in various parts
  * of the application, including a number of search pipes.
  *
  * @export
  * @class PropertyMapper
  */
 export class PropertyMapper {

   static getPropertyFromObject(target: any, propertyName: string): any {
     return this.getPropertyFromObjectInternal(target, propertyName.split('.'));
   }

   static testcases(): void {
     const a = [ {v: 'x'}, { v: 'y'}];
     const t = { foo: 'foo', bar: 'bar', sub: {foo: 'foo2', bar: 'bar2'}, a};

     // valid tests - should return the result
     const tests = [
       { test: 'sub.foo', expected: 'foo2' },       // valid - pull sub property, then pull foo property
       { test: 'a[0].v',  expected: 'x' },          // valid - pull a property, get at index 0, pull v property
       { test: 'a[1].v',  expected: 'y'},           // valid - pull a property, get at index 1, pull v property
       { test: 'a[].v',   expected: 'x,y'}          // valid - return an array of (pull a property, loop thru array -> pulling v property)
     ];
     // invalid tests - should return undefined
     tests.push(
       { test: 'noprop', expected: undefined },     // invalid - no such property noprop
       { test: 'noprop.foo', expected: undefined }, // invalid - no such property noprop
       { test: 'sub.noprop', expected: undefined }, // invalid - no such property noprop on sub
       { test: 'a[2].v', expected: undefined },     // invalid - out of bounds on the array
       { test: 'a[].noprop', expected: undefined }, // invalid - no such property on a[] elements called noprop
       { test: 'sub[foo]', expected: undefined }    // invalid - sub is not an array
       );

     for (let loop = 0; loop < tests.length; loop++) {
       const tresult = PropertyMapper.getPropertyFromObject(t, tests[loop].test);

       console.log('Result of ' + tests[loop].test + ' was: [' + tresult + '] expected: [' + tests[loop].expected + ']');
     }
   }

   private static isNumber(value: string | number): boolean {
      return ((value != null) &&
              (value !== '') &&
              !isNaN(Number(value.toString())));
   }

   /**
    * core get property from object via string array of path
    *
    * @private
    * @static
    * @param {*} target Object that we are attempting to extract the property parts from
    * @param {string[]} propertyParts array of '.' split property parts
    * @returns {*} the property or in the case of [] calls, an array of properties
    * @memberof PropertyMapper
    */
   private static getPropertyFromObjectInternal(target: any, propertyParts: string[]): any {
     let prop = null;

     let ob = target;
     let process = true;

     for (let loop = 0; loop < propertyParts.length && process; loop++) {
       let part = propertyParts[loop];
       let indexerType = IndexerTypes.None;

       if (ob !== null && ob !== undefined) {
         let indexer = null;

         if (part.endsWith(']') && part.indexOf('[') >= 0) {
           // its an array item so update parsedPart and indexer
           const arrayParts = part.split('[');

           part = arrayParts[0];
           indexer = arrayParts[1].slice(0, arrayParts[1].indexOf(']'));

           if (indexer.length === 0) {
             indexerType = IndexerTypes.Empty;
           } else {
             if (this.isNumber(indexer)) {
               indexer = Number(indexer);
               indexerType = IndexerTypes.Numeric;
             } else {
               indexerType = IndexerTypes.Keyed;
             }
           }
         }

         let found = false;
          ob = ob[part];
          prop = ob;
          found = true;

          if (indexerType !== IndexerTypes.None) {
            if (Array.isArray(ob)) {

              // If its not an empty - where we loop for each element, or its the last one
              if (indexerType !== IndexerTypes.Empty || loop === (propertyParts.length - 1)) {
                ob = ob[indexer];
                prop = ob;
              } else {
                // We have other parts following the array, so we have to recursively call for
                // the remaining propertyParts and build an array with each resulting part
                const results = [];
                let invalid = 0;

                for (let aloop = 0; aloop < ob.length; aloop++) {
                  const r = this.getPropertyFromObjectInternal(ob[aloop], propertyParts.slice(loop + 1));
                  if (r !== undefined) {
                    results.push(r);
                  } else {
                    invalid++;
                  }
                }

                if (invalid !== ob.length) {
                  prop = results;
                } else {
                  // they are all invalid, return it as undefined - very different from empty
                  prop = undefined;
                }
                process = false;
                break;
              }
            } else {
              ob = prop = undefined;
            }
          }
        }
     }

     return prop;
   }
 }

