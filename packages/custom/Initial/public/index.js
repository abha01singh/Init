'use strict'

//Theme Css
import './assets/css/common.css'
import './assets/css/boot-extent.css'
import './assets/css/custom.css'
import './assets/css/theme.css'

//Css Dependency
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
import 'node-waves/dist/waves.css'
import './assets/css/asScrollable.css'
// import './assets/css/easing.css'

//Js Theme Dependency
import 'bootstrap/dist/js/bootstrap.min.js'
import 'breakpoints.js/dist/breakpoints.min.js'

// Menubar Dependency
import './assets/js/jquery-asScrollable.js' //TODO:when npm or bower is released use them
import './assets/js/config.js'
import './assets/js/site.js'
import './assets/js/menu.js'
import './assets/js/menubar.js'
import './assets/js/run.js'
import './assets/js/asscrollable.js'

// Window Dependency
import Waves from 'node-waves/dist/waves.js'
window.Waves = Waves
import screenfull from 'screenfull/dist/screenfull.js'
window.screenfull = screenfull