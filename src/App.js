import React, { Component } from 'react';
import 'normalize.css';
import './App.scss';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notebooks: [],

      currentBookIndex: 0,
      notes: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:4000/notebooks')
      .then(res => res.json())
      .then(data => {
        this.setState({ notebooks: data }, () => {
          var bookIndex = this.state.currentBookIndex;        
          this.handleLoadNotes(bookIndex);
        });
      })
  }

  render() {
    var notebooks = this.state.notebooks;
    var notes = this.state.notes;
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
                      onClick={() => this.handleLoadNotes(index)}>
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
                <div className="note-brief">
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
        <div className="note-panel">
          <div className="header">
            <div className="category has-icon">
              <i className="iconfont icon-notebook"></i>
              读书笔记
            </div>
            <div className="title">
              <input type="text" value="读《深入理解ES6》" />
            </div>
          </div>
          <div className="body">
            <div className="editor">
              <textarea></textarea>
            </div>
            <div className="preview">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleLoadNotes(bookIndex) {
    this.setState({ currentBookIndex: bookIndex });

    var data = this.state.notebooks;
    var book = data[bookIndex];
    fetch('http://localhost:4000/notes?notebookId=' + book.id)
      .then(res => res.json())
      .then(data => {
        this.setState({ notes: data });
      }) 
  }
}

export default App;
