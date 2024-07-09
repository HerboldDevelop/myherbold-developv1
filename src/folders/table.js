import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import flow from 'lodash/flow'

import BaseFolder, { BaseFolderConnectors } from './../base-folder.js'
import { BaseFileConnectors } from './../base-file.js'


class RawTableFolder extends BaseFolder {

  constructor(props) {
    super(props); // Call the super constructor first

    this.state = {
      // Your initial state
      loading: true,
      value: [],
      getKey: []
    }
  }
   
  componentDidMount() {
    const getDeepl = async () => { // Make it an arrow function
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Accept": '*/*',
          'x-api-key': process.env.NEXT_PUBLIC_TOLGEE_API_KEY
        },
        body: JSON.stringify({key: this.getName(),namespace:"dashboard",translations:{de: this.getName().toLowerCase()},auto: true,languagesToReturn: ['en']})

      };
  try {
    await fetch('https://tolgee.myherbold.com/v2/projects/1/translations', options)
        .then(response => response.json())
        .then(response => {
          const value = [{ text: response.translations.en.text }] // Simplify array creation
  
          this.setState({ value }) // Concise update
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.setState({ loading: false }) 

        });

  } catch (e) {
    console.log(e)

  }
      
    };
    getDeepl()

  //   const getTrans = async () => { // Make it an arrow function
  //     const options = {
  //       method: 'GET',
  //       headers: {
  //         "Content-Type": 'application/json',
  //         "Accept": '*/*',
  //         'x-api-key': process.env.NEXT_PUBLIC_TOLGEE_API_KEY
  //       }
  //     };
  // try {
  //   await fetch(`https://tolgee.myherbold.com/v2/projects/1/translations?filterKeyName=${this.getName()}&languages=${this.getLocale()}`, options)
  //       .then(response => response.json())
  //       .then(response => {
  //         const getKey = [{ translation: response._embedded[0].keys[0].translations }] // Simplify array creation
  
  //         this.setState({ getKey }) // Concise update
  //       })
  //       .catch(err => console.error(err))
  //       .finally(() => {
  //         // this.setState({ loading: false }) 

  //       });

  // } catch (e) {
  //   console.log(e)

  // }
      
  //   };
  //   getTrans()
  }
     

  render() {
    const {
      isOpen, isDragging, isDeleting, isRenaming, isDraft, isOver, isSelected,
      action, url, browserProps, connectDragPreview, depth,
    } = this.props

    const icon = browserProps.icons[isOpen ? 'FolderOpen' : 'Folder']
    const inAction = (isDragging || action)

    const ConfirmDeletionRenderer = browserProps.confirmDeletionRenderer
    let company = this.getCompany()

    let name
    if (!inAction && isDeleting && browserProps.selection.length === 1) {
      name = (
        <ConfirmDeletionRenderer
          handleDeleteSubmit={this.handleDeleteSubmit}
          handleFileClick={this.handleFileClick}
          url={url}
        >
          {icon}
          {this.getName()}
        </ConfirmDeletionRenderer>
      )
    } else if ((!inAction && isRenaming) || isDraft) {
      name = (
        <div>
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            {icon}
            <input
              type="text"
              ref={this.selectFolderNameFromRef}
              value={this.state.newName}
              onChange={this.handleNewNameChange}
              onBlur={this.handleCancelEdit}
              autoFocus
            />
          </form>
        </div>
      )
    } else {
      function fixUmlauts(value) {
        value = value.replace(/ä/g, '&auml;');
        // value = value.replace(/ö/g, '&ouml;');
        value = value.replace(/ü/g, '&uuml;');
        value = value.replace(/ß/g, '&szlig;');
        value = value.replace(/Ä/g, '&Auml;');
        // value = value.replace(/Ö/g, '&Ouml;');
        value = value.replace(/Ü/g, '&Uuml;');
        return value;
    }
      name = (
        <div>
          {this.state.loading ? null : <a onClick={this.toggleFolder}>
            {icon}
            {this.getLocale() === 'de' ?  this.getName() : this.state?.value[0]?.text.toUpperCase()}
            </a>}
          
        </div>
      )
    }

    let draggable = (
      <div>
        {name}
      </div>
    )
    if (typeof browserProps.moveFile === 'function') {
      draggable = connectDragPreview(draggable)
    }

    const folder = (
      <tr
        className={ClassNames('folder', {
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onClick={this.handleFolderClick}
        onDoubleClick={this.handleFolderDoubleClick}
      >
        <td className="name">
          <div style={{ paddingLeft: (depth * 16) + 'px' }}>
            {draggable}
          </div>
        </td>
        <td className="name">
          <div style={{ paddingLeft: (depth * 16) + 'px' }}>
            {this.getCompany()}
          </div>
        </td>
        <td />
        <td />
      </tr>
    )

    return this.connectDND(folder)
  }
}

const TableFolder = flow(
  DragSource('folder', BaseFolderConnectors.dragSource, BaseFolderConnectors.dragCollect), 
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawTableFolder)

export default RawTableFolder
export { RawTableFolder }
