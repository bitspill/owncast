import { h, Component } from '/js/web_modules/preact.js';
import htm from '/js/web_modules/htm.js';
const html = htm.bind(h);

var refreshTimer;

export default class VideoPoster extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      flipped: false,
      url: this.props.src,
      active: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active && !this.state.active) {
      this.startRefreshTimer();
    } else if (!this.props.active && this.state.active) {
      this.stopRefreshTimer();
    }

    if (this.props.src !== prevProps.src) {
      this.setState({url: this.props.src })
    }
  }

  startRefreshTimer() {
    console.log('start')
    this.setState({ active: true });
    clearInterval(refreshTimer);
    // Download a new copy of the image every 20 seconds
    const refreshInterval = 20000;
    refreshTimer = setInterval(() => {
      const cachebuster = Math.round(new Date().getTime() / 1000);
      const cbUrl = this.props.src + '?cb=' + cachebuster;

      // Preload the image
      var img = new Image();
      img.onload = () => {
        this.setState({
          flipped: !this.state.flipped,
          url: cbUrl
        });
      };
      img.src = cbUrl;
    }, refreshInterval);
  }

  stopRefreshTimer() {
    console.log('stop');
    clearInterval(refreshTimer);
    this.setState({ active: false });
  }

  render() {
    return html`
      <div
        id="oc-custom-poster"
        style=${{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        ${this.secondaryImageView(this.state.url)}
        ${this.primaryImageView(this.state.url)}
      </div>
    `;
  }

  primaryImageView(url) {
    return html` ${this.imageLayer(url, 'primary-image', this.state.flipped)} `;
  }

  secondaryImageView(url) {
    return html` ${this.imageLayer(url, 'bottom-image', !this.state.flipped)} `;
  }

  imageLayer(url, id, visible) {
    return html`
      <div
        id=${id}
        class="custom-thumbnail-image"
        style=${{
          'background-image': `url(${url})`,
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          visible: visible,
        }}
      />
    `;
  }
}
