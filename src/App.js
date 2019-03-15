import React, { Component } from 'react';
import 'normalize.css';
import axios from 'axios';
import './App.scss';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    }
  };

  componentDidMount() {
    axios.get('http://localhost:3100/notebooks').then(res => {
      console.log(res.data);
      this.setState({ notebooks: res.data });
    })
  }

  render() {
    var notebooks = this.state.notebooks;
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
                  {
                    notebooks.map((notebook, index) => (
                    <li key={notebook.id} className="notebook-item">
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
              <li>
                <div className="note-brief">
                  <div className="header">新建笔记</div>
                  <div className="body">
                    笔记简要内容
                  </div>
                  <div className="footer">
                    <div className="datetime">2019-3-5</div>
                    <button className="trash button">
                      <i className="iconfont icon-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="note-panel">
          <div className="header">
            <div className="category has-icon">
              <i className="iconfont icon-notebook"></i>
              我的2018
            </div>
            <div className="title">
              <input type="text"  />
            </div>
          </div>
          <div className="body">
            <div className="editor">
              <textarea></textarea>
            </div>
            <div className="preview">
              <div>内容</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
