import { Widget } from '@lumino/widgets';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { Drag, IDragEvent } from '@lumino/dragdrop';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { Dropzone} from './dropzone';
import { StickyContent } from './content';

export class StickyTab extends Widget {
  stickyContainer: HTMLElement;
  node: HTMLElement;
  static numTabs: number = 0;
  // static currentTabId: String;

  constructor(stickyContainer: HTMLElement) {
    super();
    this.stickyContainer = stickyContainer;

    // Add the tab element
    this.node = document.createElement('div');
    this.node.classList.add('sticky-tab-bar');
    
    // Add new cell button
    // var addCell = document.createElement('div');
    // addCell.classList.add('add-cell')
    this.node.innerHTML += '<button class="add-cell">+</button>';
    // this.node.appendChild(addCell);

    this.stickyContainer.append(this.node);
    
    var addCell = document.getElementsByClassName("add-cell");
    addCell[0].addEventListener("click", this.clickAddTab);

    // Initialize the tab
    this.createFirstTab();
    StickyTab.numTabs++;

  }

  createFirstTab = () => {
    this.node.classList.add('sticky-tab');
    var addCell = this.node.lastChild;
    this.node.removeChild(addCell!);
    this.node.innerHTML += `<button class="tab" name="New ${Dropzone.numDz}">New ${Dropzone.numDz}</button>`;
    // this.node.innerHTML += '<button class="tab">Tab1</button>';
    // this.node.innerHTML += '<button class="tab">Tab2</button>';
    // this.node.innerHTML += '<button class="tab">Tab3</button>';
    // this.node.innerHTML += '<button class="tab">Tab4</button>';
    this.node.appendChild(addCell!);
    
    // this.node.innerHTML += '<button class="tab">Tab3</button>';

    var tabs = document.getElementsByClassName("tab");
    tabs[0].className += " current";
    // for (var i = 0; i < tabs.length; i++) {
    tabs[0].addEventListener("click", this.clickTab);
    // tabs[i].innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" data-icon="ui-components:close" data-icon-id="58648a58-146c-4974-9873-7d2dfb468b8d"><g class="x-icon-none x-icon-selectable-inverse x-icon3-hover" fill="none"><circle cx="12" cy="12" r="11"></circle></g><g class="x-icon3 x-icon-selectable x-icon-accent2-hover" fill="#616161"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g><g class="x-icon-none x-icon-busy" fill="none"><circle cx="12" cy="12" r="7"></circle></g></svg>'
    tabs[0].innerHTML += '<svg class="delete-tab" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" data-icon="ui-components:close" data-icon-id="58648a58-146c-4974-9873-7d2dfb468b8d"><g class="x-icon-circle" fill="none"><circle cx="12" cy="12" r="11"></circle></g><g class="x-icon" fill="#616161"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>'
    var deleteTab = document.getElementsByClassName("delete-tab");
    deleteTab[0].addEventListener("click", this.clickDeleteTab);
    // }
    // StickyTab.currentTabId = `New Cell ${Dropzone.numDz}`;
    // document.getElementById("New Cell 0")
  }

  clickTab = ( evt: Event ) => {
    if ((evt.target as Element).getAttribute("class") && (evt.target as Element).className.includes('tab')) {
      var tabcontent = document.getElementsByClassName("sticky-content");
      for (var i = 0; i < tabcontent.length; i++) {
        (tabcontent[i] as HTMLElement).style.display = "none";
      }

      var tabs = document.getElementsByClassName("tab");
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" current", "");
      }

      var id = (evt.target as Element).getAttribute("name");
      document.getElementById(id!)!.style.display = "flex";
      
      (evt.target as Element).className += " current";
    } else {
      var deleteTab = document.getElementsByClassName("delete-tab");
      for (var i = 0; i < deleteTab.length; i++) {
        deleteTab[i].addEventListener("click", this.clickDeleteTab);
      }
    }
    
  }

  clickAddTab = () => {
    var tabs = document.getElementsByClassName("tab");
    console.log(tabs.length);
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].className = tabs[i].className.replace(" current", "");
    }

    var addCell = this.node.lastChild;
    this.node.removeChild(addCell!);
    var cellNum = Dropzone.numDz;
    this.node.innerHTML += `<button class="tab current" name="New ${cellNum}">New ${cellNum}</button>`;
    this.node.appendChild(addCell!);

    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", this.clickTab);
    }
    tabs[StickyTab.numTabs].innerHTML += '<svg class="delete-tab" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" data-icon="ui-components:close" data-icon-id="58648a58-146c-4974-9873-7d2dfb468b8d"><g class="x-icon-circle" fill="none"><circle cx="12" cy="12" r="11"></circle></g><g class="x-icon" fill="#616161"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>'
    var deleteTab = document.getElementsByClassName("delete-tab");
    for (var i = 0; i < deleteTab.length; i++) {
      deleteTab[i].addEventListener("click", this.clickDeleteTab);
    }

    new StickyContent(this.stickyContainer, StickyContent.notebook);

    var tabcontent = document.getElementsByClassName("sticky-content");
    for (var i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
    document.getElementById(`New ${cellNum}`)!.style.display = "flex";
    // StickyTab.currentTabId = `New Cell ${cellNum}`;
    
    StickyTab.numTabs++;
  }

  clickDeleteTab = (evt:Event) => {
    var deleteTab = (evt.currentTarget as Element).parentNode;
    var deleteHTML = (evt.currentTarget as Element).parentElement;
    var deleteContent = document.getElementById(deleteHTML!.getAttribute("name")!);
    this.node.removeChild(deleteTab!);
    this.stickyContainer.removeChild(deleteContent!);

    StickyTab.numTabs--;
    if (StickyTab.numTabs > 0) {
      var tabs = document.getElementsByClassName("tab");
      if (!tabs[0].className.includes('current')) {
        tabs[0].className += " current";
      }
      document.getElementById(tabs[0].getAttribute("name")!)!.style.display = "flex";
    } else {
      this.clickAddTab();
    }
    // (tabs[0] as HTMLElement).classList.add('current');
    // (tabs[0] as HTMLElement).style.display = "flex";
  }
      
  // addDeleteListener() {
  //   var deleteTab = document.getElementsByClassName("delete-tab");
  //   for (var i = 0; i < deleteTab.length; i++) {
  //     deleteTab[i].addEventListener("click", this.clickDeleteTab);
  //   }
  // }

}
