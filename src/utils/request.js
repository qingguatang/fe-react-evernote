const env = process.env.REACT_APP_ENV || process.env.NODE_ENV;

const host = env === 'development' ?
    'http://localhost:4000' :
    'https://my-json-server.typicode.com/qingguatang/fe-react-evernote';

export default function(path, options) {
  const url = host + path;
  return window.fetch(url, options).then(res => res.json());
}