import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { formatDistanceToNow } from 'date-fns'
import flow from 'lodash/flow'
import BaseFile, { BaseFileConnectors } from './../base-file.js'
import { fileSize } from './utils.js'

class RawTableFile extends BaseFile {
  render() {
    const {
      isDragging, isDeleting, isRenaming, isOver, isSelected,
      action, url, browserProps, connectDragPreview,
      depth, size, modified,
    } = this.props

    const icon = browserProps.icons[this.getFileType()] || browserProps.icons.File
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
      name = (
        <a
          href={url || '#'}
          download="download"
          onClick={this.handleFileClick}
        >
          {icon}
          {this.getName()}
        </a>
      )
    }

    function fixUmlauts(value) {
      value = value.replace(/ä/g, '&auml;');
      value = value.replace(/ö/g, '&ouml;');
      value = value.replace(/ü/g, '&uuml;');
      value = value.replace(/ß/g, '&szlig;');
      value = value.replace(/Ä/g, '&Auml;');
      value = value.replace(/Ö/g, '&Ouml;');
      value = value.replace(/Ü/g, '&Uuml;');
      return value;
  }

    let draggable = (
      <div>
        {fixUmlauts(name)}
      </div>
    )
    if (typeof browserProps.moveFile === 'function') {
      draggable = connectDragPreview(draggable)
    }

    const row = (
      <tr
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
        {/* <td className="size">{fileSize(size)}</td>
        <td className="modified">
          {typeof modified === 'undefined' ? '-' : formatDistanceToNow(modified, { addSuffix: true })}
        </td> */}
      </tr>
    )

    return this.connectDND(row)
  }
}

const TableFile = flow(
  DragSource('file', BaseFileConnectors.dragSource, BaseFileConnectors.dragCollect), 
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawTableFile)

export default TableFile
export { RawTableFile }
