import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const GenButton = (data) => {
  const { generating, site, doneGenerating, generateImages, setGenerating, setDoneGenerating, base, setBase } = data.props;
  const done = ((generating === site) || (doneGenerating === site && generating === 'done'));
  const disabled = done ? { "pointerEvents": "none" } : {};

  return (

    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Button variant="contained" disabled={done} onClick={() => generateImages(site, setGenerating, setDoneGenerating, base, setBase)} style={disabled}>{done ? 'Generating' : 'Generate' }
          {done && <span>&nbsp;&nbsp;<span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" disabled={done} onClick={() => generateImages(site, setGenerating, setDoneGenerating, base, setBase, true)} style={disabled}>{done ? 'Generating' : 'Generate Dev' }
          {done && <span>&nbsp;&nbsp;<span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>}
        </Button>
      </Grid>
    </Grid>
  );
}

export default GenButton;
