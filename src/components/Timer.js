import React from 'react';

export class Timer extends React.Component {

    state = {
        elapsed: 0,
        timeText: null,
    };

    shouldComponentUpdate() {
        return !this.props.limitElapsed;
    }

    constructor(props) {
        super(props);
        Timer.tick = Timer.tick.bind(this);
    };

    componentDidMount(){
        Timer.timer = setInterval(Timer.tick, 100);
    };

    componentWillUnmount(){
        this.deleteTimer();
    };

    deleteTimer() {
        clearInterval(Timer.timer);
        this.setState({
            elapsed: 0,
        });
    };

    static tick() {
        const elapsed = Math.round(this.props.limitSec * 10 - this.state.elapsed / 100);
        const seconds = (elapsed / 10).toFixed(0);
        this.setState({
            elapsed: new Date() - Timer.start,
            timeText: <p>You have <b>{seconds} sec</b></p>,
        });
        if (this.props.isFinal) {
            this.deleteTimer();
        }
        if (Math.floor(+seconds) === 0) {
            this.setState({
                timeText: <p><b>Time is gone</b></p>,
            });
            this.props.setIsLoseState(true, () => this.props.setIsLimitElapsed);
            this.deleteTimer();
        }
    };

    render() {
        return (
            <div className="nav navbar-nav navbar-right">
                {this.state.timeText}
            </div>
        );
    }
}
