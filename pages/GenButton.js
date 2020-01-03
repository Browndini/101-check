import React from 'react';

const GenButton = (data) => {
  const { generating, site, doneGenerating, generateImages, setGenerating, setDoneGenerating, base, setBase } = data.props;
  const disabled = ((generating === site) || (doneGenerating === site && generating === 'done')) ? { "pointerEvents": "none" } : {};

  return (
    <div className='button'  onClick={() => generateImages(site, setGenerating, setDoneGenerating, base, setBase)} style={disabled}>
      {(generating === site) ? 
        (<span>Generating <span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>) :
          ((doneGenerating === site && generating === 'done') ? 'Done!' : 'Generate')}
    </div>
  );
}

export default GenButton;
