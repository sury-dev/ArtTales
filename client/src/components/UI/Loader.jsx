import './Loader.css'

function Loader({ size = 60, outerColor = '#ff69b4', innerColor = '#b000e8' }) {
    const outerStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderTopColor: outerColor,
    };

    const innerSize = size * 0.7;
    const innerStyle = {
        width: `${innerSize}px`,
        height: `${innerSize}px`,
        borderBottomColor: innerColor,
    };

    return (
        <div className="orbit-wrapper" style={{ width: `${size}px`, height: `${size}px` }}>
            <div className="orbit-spinner" style={outerStyle}></div>
            <div className="orbit-inner-spinner" style={innerStyle}></div>
        </div>
    );
}

export default Loader
