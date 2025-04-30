import React, {Component} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';

export default class TypingText extends Component {
  constructor() {
    super();

    this.index = 0;

    this.typing_timer = -1;

    this.blinking_cursor_timer = -1;

    this.state = {text: '', blinking_cursor_color: 'transparent'};
  }

  componentDidMount() {
    if (this.props.animation) {
      this.typingAnimation();
      this.blinkingCursorAnimation();
    }
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  clearTimers = () => {
    clearTimeout(this.typing_timer);
    this.typing_timer = -1;

    clearInterval(this.blinking_cursor_timer);
    this.blinking_cursor_timer = -1;
  };

  typingAnimation = () => {
    if (!this.props.animation) {
      return;
    }

    clearTimeout(this.typing_timer);
    this.typing_timer = -1;

    if (this.index < this.props?.text?.length) {
      if (this.refs.animatedText) {
        this.setState(
          {text: this.state.text + this.props.text.charAt(this.index)},
          () => {
            this.index++;
            this.props.handleTypingScroll(this.index, this.typingAnimation);
            this.typing_timer = setTimeout(() => {
              this.typingAnimation();
            }, this.props.typingAnimationDuration);
          },
        );
      }
    }
  };

  blinkingCursorAnimation = () => {
    if (!this.props.animation) {
      return;
    }

    this.blinking_cursor_timer = setInterval(() => {
      if (this.refs.animatedText) {
        if (this.state.blinking_cursor_color === 'transparent') {
          this.setState({blinking_cursor_color: this.props.color});
        } else {
          this.setState({blinking_cursor_color: 'transparent'});
        }
      }
    }, this.props.blinkingCursorAnimationDuration);
  };

  render() {
    return (
      <View style={{paddingBottom: 20}}>
        <Text
          ref="animatedText"
          style={{
            color: this.props.color,
            fontSize: this.props.textSize,
            textAlign: 'left',
            lineHeight: 20,
          }}>
          {this.props.animation ? this.state.text : this.props.text}
          {this.props.animation && (
            <Text style={{color: this.state.blinking_cursor_color}}>|</Text>
          )}
        </Text>
      </View>
    );
  }
}

TypingText.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  textSize: PropTypes.number,
  typingAnimationDuration: PropTypes.number,
  blinkingCursorAnimationDuration: PropTypes.number,
};

TypingText.defaultProps = {
  text: '',
  color: udyamitaTheme.textColor,
  fontFamily: udyamitaTheme.mainThemeFontFamily,  //Todo
  textSize: 12,
  // lineHeight: 16,
  typingAnimationDuration: 50,
  blinkingCursorAnimationDuration: 190,
};
