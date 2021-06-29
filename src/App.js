import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsBackup: [],
      items: [],
      index: -1,
      text: '',
    };
    this.onChange = this.onChange.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.undo = this.undo.bind(this);
    this.select = this.select.bind(this);
    this.timer = 0;
    this.preventSimpleClick = false;
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  add(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    this.setState(state => ({
      itemsBackup: [...state.items],
      items: state.items.concat(this.state.text),
      text: ''
    }));
  }

  remove() {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    if (this.state.index >= 0) {
      const backup = [...this.state.items];
      this.state.items.splice(this.state.index, 1);
      this.setState({
        itemsBackup: backup,
        items: this.state.items,
        index: -1
      });
    }
  }

  undo() {
    this.setState({
      items: this.state.itemsBackup,
      index: -1
    });
  }

  select(index) {
    this.timer = 0;
    this.preventSimpleClick = false;
    this.timer = setTimeout(() => {
      if(!this.preventSimpleClick){
        this.setState({ index: this.state.index === index ? -1 : index });
      }
    }, 200);
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center my-4">
          <div className="col-10">
            <h3>TODO</h3>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-6">
            <input
              className="form-control"
              onChange={this.onChange}
              value={this.state.text} />
          </div>
          <div className="col-4">
            <button className="btn btn-primary me-1" onClick={this.add}>+</button>
            <button className="btn btn-danger me-1" onClick={this.remove}>-</button>
            <button className="btn btn-secondary" onClick={this.undo}>Deshacer</button>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-10">
            <List
              index={this.state.index}
              items={this.state.items}
              onClick={this.select}
              onDoubleClick={(index) => {
                console.log(2);
                this.select(index);
                this.remove();
              }}/>
          </div>
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.items.map((item, index) => (
          <button
            className={`list-group-item list-group-item-action ${this.props.index == index ? 'active' : ''}`}
            onClick={() => this.props.onClick(index)}
            onDoubleClick={() => this.props.onDoubleClick(index)}
            key={item.id}>
            {item}
          </button>
        ))}
      </ul>
    );
  }
}

export default App;
