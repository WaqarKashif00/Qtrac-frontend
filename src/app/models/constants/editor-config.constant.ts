import { AngularEditorConfig } from '@kolkov/angular-editor';

export const EditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '120px',
    minHeight: '0',
    maxHeight: '120px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'Houschka Rounded Alt', name: 'Houschka Rounded Alt'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
  [
    'undo',
    'redo',
    'indent',
    'subscript',
    'superscript',
    'outdent'
  ],
  [
    'insertHorizontalRule',
    'backgroundColor',
    'customClasses',
    'link',
    'unlink',
    'insertImage',
    'insertVideo',
    'removeFormat',
    'toggleEditorMode'
  ]
  ]
};
