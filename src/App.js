import React, { Component } from 'react';
import 'normalize.css';
import marked from 'marked';
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
    fetch('http://localhost:4000/notebooks')
      .then(res => res.json())
      .then(notebooks => {
        this.setState({ notebooks: notebooks }, () => {
          var bookIndex = this.state.currentBookIndex;        
          this.loadNotes(bookIndex);
        });
      })
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
            <button className="button adder">
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
                      className={'notebook-item ' + (this.state.currentBookIndex === index ? 'active' : '')}
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
              <li>
                <div className={'note-brief ' + (currentNote && currentNote.id === note.id ? 'active' : '')}
                    onClick={() => this.loadNote(note.id)}>
                  <div className="header">{note.title}</div>
                  <div className="body">
                  {note.body}
                  </div>
                  <div className="footer">
                    <div className="datetime">{note.datetime}</div>
                    <button className="trash button">
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
              {this.getNoteBook(currentNote.id).name}
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
            <div className="preview">
              <div dangerouslySetInnerHTML={{ __html: marked(currentNote.body || '') }}></div>
            </div>
          </div>
        </div> : null
        }
      </div>
    );
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
}

export default App;
