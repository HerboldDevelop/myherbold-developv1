import React, {useState, useEffect} from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { formatDistanceToNow } from 'date-fns'
import flow from 'lodash/flow'
import BaseFile, { BaseFileConnectors } from './../base-file.js'
import { fileSize, getDeepl } from './utils.js'



class RawTableFile extends BaseFile {
  _renderCounter = () => () => {



    const [translate, setTranslate] = useState('')
    async function getDeepl() {
         const options = {
           method: 'POST',
           headers: {
             "Content-Type": 'application/json',
             "Accept": '*/*',
             'x-api-key': 'tgpak_gfpwczdcgjrdomtqgzyxk3zqnazti23egbvxm3zzozswy'
           },
           body: JSON.stringify({key: this.getName(),namespace:"dashboard",translations:{de: this.getName().toLowerCase()},auto: true,languagesToReturn:  ["en"]})
         };
         
        const valtrans = await fetch('https://tolgee.myherbold.com/v2/projects/1/translations', options)
           .then(response => response.json())
           .then(response => {
              setTranslate(response.translations.en.text)
            })
           .catch(err => console.error(err));
       
        }
        getDeepl()
      return <div>{translate}</div>
      }
       
     
  
  render() {
    const Translations = this._renderCounter()

    const {
      isDragging, isDeleting, isRenaming, isOver, isSelected,
      action, url, browserProps, connectDragPreview,
      depth, size, modified,
    } = this.props

    const icon = browserProps.icons[this.getFileType()] || browserProps.icons.File
    const iconShop = browserProps.icons[this.getFileType()] || browserProps.icons.SHOP

    const inAction = (isDragging || action)

    const ConfirmDeletionRenderer = browserProps.confirmDeletionRenderer

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
    } else if (!inAction && isRenaming) {
      name = (
        <form className="renaming" onSubmit={this.handleRenameSubmit}>
          {icon}
          <input
            ref={this.selectFileNameFromRef}
            type="text"
            value={this.state.newName}
            onChange={this.handleNewNameChange}
            onBlur={this.handleCancelEdit}
            autoFocus
          />
        </form>
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
        {!this.getName().includes('.xls') && !this.getName().includes('.xlsx') ? <a
          href={url || '#'}
          download="download"
          onClick={this.handleFileClick}
        >
          {icon}
          {<Translations />}
        </a> : <a
          href={url || '#'}
          download="download"
          onClick={this.handleShopClick}
        >
          {iconShop}
          Spare Part Catalog / Ersatzteilkatalog
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

    const row = (
      <><tr
        className={ClassNames('file', {
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onClick={this.handleItemClick}
        onDoubleClick={this.handleItemDoubleClick}
      >
        <td className="name">
          <div style={{ paddingLeft: (depth * 16) + 'px' }}>
            {draggable}
          </div>
        </td>
        {/* <td className="size">{fileSize(size)}</td> */}
      
      </tr>
      {/* <tr
      className={ClassNames('mail', {
        pending: action,
        dragging: isDragging,
        dragover: isOver,
        selected: isSelected,
      })}
      onClick={this.handleMailClick}
      >
        <td className="name">
        {!this.getName().includes('.xls') && !this.getName().includes('.xlsx') ?  <button 
 style={{ padding: "5px", marginTop: "2px", cursor: 'pointer', backgroundColor: '#1A4B7E', borderRadius: "3px", color: 'white' }}>
           Dokument per E-Mail senden | Send document via email
          </button> : null }
        </td>      
      </tr> */}
      </>
    )

    return this.connectDND(row)
  }
}

const TableFile = flow(
  DragSource('file', BaseFileConnectors.dragSource, BaseFileConnectors.dragCollect), 
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawTableFile)

export default RawTableFile
export { RawTableFile }
