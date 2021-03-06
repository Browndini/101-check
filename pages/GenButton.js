import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const GenButton = ({ generating, site, doneGenerating, generateImages, setGenerating, setDoneGenerating, base, setBase, setCompleted }) => {
  const genning = ((generating === site) || (doneGenerating === site && generating === 'done'));
  const disabled = genning ? { "pointerEvents": "none" } : {};
  return (

    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Button variant="contained" disabled={genning} onClick={() => generateImages(site, setGenerating, setDoneGenerating, base, setBase, false, setCompleted)} style={disabled}>{genning ? 'Generating' : 'Generate' }
          {genning && <span>&nbsp;&nbsp;<span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" disabled={genning} onClick={() => generateImages(site, setGenerating, setDoneGenerating, base, setBase, true, setCompleted)} style={disabled}>{genning ? 'Generating' : 'Generate Dev' }
          {genning && <span>&nbsp;&nbsp;<span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>}
        </Button>
      </Grid>
    </Grid>
  );
}

export default GenButton;
