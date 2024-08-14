export const tableRow = node => node.tagName.toLowerCase() === 'tr';
export const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};