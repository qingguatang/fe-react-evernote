import React, { Component } from 'react';
import 'normalize.css';
import 'github-markdown-css';
import marked from 'marked';
import cx from 'classnames';
import Swal from 'sweetalert2';
import dateUtil from './utils/date';
import './App.scss';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notebooks: [],

      currentBookIndex: 0,
      notes: [],

      currentNote: null
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      var data = {
        currentBookIndex: this.state.currentBookIndex,
        currentNoteId: this.state.currentNote ? this.state.currentNote.id : null
      };
      localStorage.setItem('evernoteEditData', JSON.stringify(data));
    });

    var json = localStorage.getItem('evernoteEditData');
    if (json) {
      var data = JSON.parse(json);
      this.setState({ currentBookIndex: data.currentBookIndex });
    }
    this.loadNotebooks(data);
  }

  render() {
    var notebooks = this.state.notebooks;
    var notes = this.state.notes;
    var currentNote = this.state.currentNote;
    // if (!notebooks) {
    //   return null;
    // }

    return (
      <div className="app">
        <div className="sidebar">
          <div className="header">
            <button className="button adder" onClick={() => this.addNote()}>
              <i className="iconfont icon-add"></i>
              新建笔记
            </button>
          </div>
          <div className="body">
            <div className="notebooks">
              <div className="header has-icon">
                <i className="iconfont icon-books"></i>
                笔记本
              </div>
              <div className="body">
                <ul className="notebooks-list">
                {notebooks.map((notebook, index) => (
                  <li key={notebook.id}
                      className={cx('notebook-item', { active: this.state.currentBookIndex === index })}
                      onClick={() => this.loadNotes(index)}>
                    <div className="title has-icon">
                      <i className="iconfont icon-book"></i>
                      {notebook.name}
                    </div>
                    <button className="button trash"><i className="iconfont icon-trash"></i></button>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="notes-panel">
          <div className="header">读书笔记</div>
          <div className="body">
            <ul className="notes-list">
            {
              notes.map(note => (
              <li key={note.id}>
                <div className={cx('note-brief', { active: currentNote && currentNote.id === note.id })}>
                  <div className="box"
                      onClick={() => this.loadNote(note.id)}>
                    <div className="header">{note.title}</div>
                    <div className="body">
                    {note.body}
                    </div>
                  </div>
                  <div className="footer">
                    <div className="datetime">{dateUtil.friendly(note.datetime)}</div>
                    <button className="trash button" onClick={() => this.deleteNote(note.id)}>
                      <i className="iconfont icon-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
              ))
            }
            </ul>
          </div>
        </div>
        {currentNote ?
        <div className="note-panel">
          <div className="header">
            <div className="category has-icon">
              <i className="iconfont icon-notebook"></i>
              {this.getNoteBook(currentNote.notebookId).name}
            </div>
            <div className="title">
              <input type="text" value={currentNote.title || ''}
                onChange={e => this.updateNote('title', e.target.value)} />
            </div>
          </div>
          <div className="body">
            <div className="editor">
              <textarea value={currentNote.body}
                onChange={e => this.updateNote('body', e.target.value)}></textarea>
            </div>
            <div className="preview markdown-body">
              <div dangerouslySetInnerHTML={{ __html: marked(currentNote.body || '') }}></div>
            </div>
          </div>
        </div> : null
        }
      </div>
    );
  }

  loadNotebooks(editData) {
    editData = editData || {};
    fetch('http://localhost:4000/notebooks')
      .then(res => res.json())
      .then(notebooks => {
        this.setState({ notebooks: notebooks }, () => {
          var bookIndex = editData.currentBookIndex || 0;
          this.loadNotes(bookIndex);
          if (editData.currentNoteId) {
            this.loadNote(editData.currentNoteId);
          }
        });
      })
  }

  loadNotes(bookIndex) {
    this.setState({ currentBookIndex: bookIndex });
    var data = this.state.notebooks;
    var book = data[bookIndex];
    fetch('http://localhost:4000/notes?notebookId=' + book.id)
      .then(res => res.json())
      .then(notes => {
        this.setState({ notes: notes });
      }) 
  }

  reloadNotes() {
    var bookIndex = this.state.currentBookIndex;
    this.loadNotes(bookIndex);
  }

  loadNote(id) {
    fetch('http://localhost:4000/notes/' + id)
      .then(res => res.json())
      .then(note => {
        console.log(note)
        this.setState({ currentNote: note });
      })  
  }

  getNoteBook(bookId) {
    var books = this.state.notebooks;
    return books.find(book => book.id === bookId);
    // return books.find(function(book) {
    //   return book.id === bookId;
    // });
  }

  updateNote(field, value) {
    var note = this.state.currentNote;
    note[field] = value;
    this.setState({ note: note});

    var opts = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    }
    fetch('http://localhost:4000/notes/' + note.id, opts)
      .then(res => res.json())
      .then(data => {
        console.log('success!', data);
      })  
  }

  addNote() {
    var currentBook = this.state.notebooks[this.state.currentBookIndex];
    var note = {
      title: '新建笔记',
      body: '',
      datetime: new Date().toString(),
      notebookId: currentBook.id
    };

    var opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    }

    fetch('http://localhost:4000/notes/', opts)
      .then(res => res.json())
      .then(data => {
        this.reloadNotes();
      })  
  }

  deleteNote(id) {
    Swal.fire({
      title: '确定要删除吗？',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.doDeleteNote(id);
      }
    })
  }


  doDeleteNote(id) {
    var opts = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch('http://localhost:4000/notes/' + id, opts)
      .then(res => res.json())
      .then(data => {
        this.reloadNotes();
      })  
  }
}

export default App;
