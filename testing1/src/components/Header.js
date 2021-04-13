import { AppBar, Typography } from '@material-ui/core'
import React from 'react'

const Header = () => {
    return (
        <div>
            <AppBar>
                <Typography variant="h3" classname={classes.title}>
                    Mindex
                </Typography>
            </AppBar>
        </div>
    )
}

export default Header
