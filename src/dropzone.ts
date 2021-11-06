import { Widget } from '@lumino/widgets';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { Drag, IDragEvent } from '@lumino/dragdrop';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { StickyContent } from './content';

/**
 * Class that implements the Dropzone state where the StickyContent is empty
 * and waiting for users to drop some cells.
 */
export class Dropzone extends Widget {
  stickyContent: StickyContent;
  node: HTMLElement;

  constructor(stickyContent: StickyContent) {
    super();
    this.stickyContent = stickyContent;

    // Add a dropzone element (providing feedback of drag-and-drop)
    this.node = document.createElement('div');
    this.node.classList.add('dropzone');
    this.stickyContent.node.append(this.node);

    // Initialize the content
    const label = document.createElement('span');
    label.classList.add('dropzone-label');
    label.innerHTML = 'Create a cell or drag one here';
    this.node.append(label);
  }

  dragEnterHandler(event: IDragEvent) {
    console.log('content drag enter');
  }
}
