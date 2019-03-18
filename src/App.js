import React, { Component } from 'react';
import 'normalize.css';
import 'github-markdown-css';
import axios from 'axios';
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
    }
  };

  componentDidMount() {
    axios.get('http://localhost:3100/notebooks').then(res => {
      console.log(res.data);
      this.setState({ notebooks: res.data });
      var book = res.data[this.state.currentBookIndex];
      this.loadNotes(book.id);
    })
  }

  render() {
    var notebooks = this.state.notebooks;
    var currentNote = this.state.currentNote;
    return (
      <div className="app">
        <div className="sidebar">
          <div className="header">
            <button className="button adder" onClick={() => this.handleAddNote()}>
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
                  {
                    notebooks.map((notebook, index) => (
                    <li key={notebook.id} className={"notebook-item " + (this.state.currentBookIndex === index ? 'active' : '')}
                        onClick={() => this.handleBookSelect(index)}>
                      <div className="title has-icon">
                        <i className="iconfont icon-book"></i>
                        {notebook.name}
                      </div>
                      <button className="button trash"><i className="iconfont icon-trash"></i></button>
                    </li>   
                    ))
                  }
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
              this.state.notes.map((note, index) => (
               <li key={note.id}>
                <div className="note-brief">
                  <div className="box" onClick={() => this.handleEditNote(note.id)}>
                    <div className="header">{note.title}</div>
                    <div className="body">
                      {note.body}
                    </div>
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
        { currentNote ? 
          <div className="note-panel">
            <div className="header">
              <div className="category has-icon">
                <i className="iconfont icon-notebook"></i>
                我的2018
              </div>
              <div className="title">
                <input name="title" type="text" value={currentNote.title} onChange={e => this.handleFieldChange(e)} />
              </div>
            </div>
            <div className="body">
              <div className="editor">
                <textarea name="body" value={currentNote.body} onChange={e => this.handleFieldChange(e)}></textarea>
              </div>
              <div className="preview markdown-body">
                <div dangerouslySetInnerHTML={{__html: marked(currentNote.body)}}></div>
              </div>
            </div>
          </div> : null
        }
      </div>
    );
  }

  handleAddNote() {
    var book = this.state.notebooks[this.state.currentBookIndex];
    var note = {
      title: '新建笔记',
      body: '',
      datetime: new Date().toISOString(),
      bookId: book.id
    };
    axios.post('http://localhost:3100/notes', note).then(() => {
      this.reloadNotes();
    });
  }

  handleBookSelect(index) {
    this.setState({ currentBookIndex: index });
    var book = this.state.notebooks[index];
    // book.id
    this.loadNotes(book.id);
  }

  loadNotes(id) {
    axios.get('http://localhost:3100/notes?bookId=' + id).then(res => {
      console.log(res.data);
      this.setState({ notes: res.data });
    })
  }

  reloadNotes() {
    var book = this.state.notebooks[this.state.currentBookIndex];
    this.loadNotes(book.id);
  }

  handleEditNote(id) {
    axios.get('http://localhost:3100/notes/' + id).then(res => {
      this.setState({ currentNote: res.data });
    });
  }

  handleFieldChange(e) {
    var currentNote = this.state.currentNote;
    var name = e.target.name;
    currentNote[name] = e.target.value;

    this.setState({ currentNote: currentNote });
  }
}

export default App;
