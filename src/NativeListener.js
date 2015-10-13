import {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
const events = [
  'KeyDown',
  'KeyPress',
  'KeyUp',
  'Click',
  'ContextMenu',
  'DoubleClick',
  'Drag',
  'DragEnd',
  'DragEnter',
  'DragExit',
  'DragLeave',
  'DragOver',
  'DragStart',
  'Drop',
  'MouseDown',
  'MouseEnter',
  'MouseLeave',
  'MouseMove',
  'MouseOut',
  'MouseOver',
  'MouseUp'
];

const aliases = {
  'DoubleClick': 'dblclick'
};

const toEventName = event =>
  (aliases[event] || event).toLowerCase();

export default class NativeListener extends Component {
  static displayName = 'NativeListener';
  static propTypes = {
    children: (props, propName) => {
      if (props[propName].length) {
        return new Error('NativeListener can only wrap one element');
      }
    },
    ...events.reduce((accumulator, event) => ({
      ...accumulator,
      [`on${event}`]: PropTypes.func,
      [`on${event}Capture`]: PropTypes.func,
      [`stop${event}`]: PropTypes.bool
    }), {})
  };

  componentDidMount() {
    const props = this.props;
    const element = ReactDOM.findDOMNode(this);
    events.forEach(event => {
      const capture = props['on' + event + 'Capture'];
      const bubble = props['on' + event];
      const stop = props['stop' + event];
      if (capture && typeof capture === 'function') {
        element.addEventListener(toEventName(event), capture, true);
      }
      if (bubble && typeof bubble === 'function') {
        element.addEventListener(toEventName(event), bubble, false);
      }
      if (stop === true) {
        element.addEventListener(toEventName(event), nativeEvent => nativeEvent.stopPropagation(), false);
      }
    });
  }

  render() {
    return this.props.children;
  }
}
