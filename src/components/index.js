import ErrorBar from './ErrorBar'
import withRoot from '../withRoot'
import { UserCard } from './UserCard'
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import StarsIcon from '@material-ui/icons/Stars'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import TableFooter from '@material-ui/core/TableFooter'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TablePagination from '@material-ui/core/TablePagination'
import CircularProgress from '@material-ui/core/CircularProgress'
import TablePaginationActions from './table/TablePaginationActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import { getGithubRepos, getGithubUser } from '../infrastructure/api'

/**
 * GitHub user name
 */
const DEFAULT_GITHUB_USERNAME = 'yeexel'

/**
 * Table page start number
 */
const PAGE_NUMBER = 1

/**
 * GitHub repositories per page.
 * Available options: [10, 20, 50]
 */
const REPOS_PER_PAGE = 10

const styles = theme => ({
  button: { margin: theme.spacing.unit },
  card: { display: 'flex', border: 'none', padding: theme.spacing.unit * 2 },
  close: { width: theme.spacing.unit * 4, height: theme.spacing.unit * 4 },
  content: { flex: '1 0 auto' },
  cover: { width: 151, height: 151 },
  details: { display: 'flex', width: theme.spacing.unit * 35, flexDirection: 'column' },
  paper: { textAlign: 'center', marginTop: theme.spacing.unit * 2, color: theme.palette.text.secondary },
  root: { textAlign: 'center' },
  table: { minWidth: 500 },
  tableWrapper: { overflowX: 'auto' }
})

class Index extends Component {
  state = {
    error: null,
    isLoadingRepos: true,
    page: PAGE_NUMBER,
    perPage: REPOS_PER_PAGE,
    repos: [],
    reposNumber: 0,
    showUserNameChangeModal: false,
    userFullName: null,
    userName: DEFAULT_GITHUB_USERNAME,
    userPic: null
  }

  constructor(props) {
    super(props)

    this.emailInputRef = null

    this.setEmailInputRef = input => {
      this.emailInputRef = input
    }
  }

  componentDidMount() {
    this.loadData(this.state.userName)
  }

  loadData = userName => {
    this.fetchGithubUser(userName)
    this.fetchGithubRepos(userName)
  }

  toggleUserNameChangeModal = () => {
    const { showUserNameChangeModal } = this.state

    this.setState({ showUserNameChangeModal: !showUserNameChangeModal })
  }

  handleUserNameChange = e => {
    this.setState({ userName: e.target.value })
  }

  handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ error: null })
  };

  fetchGithubUser = async (userName) => {
    try {
      const remoteUser = await getGithubUser(userName)

      this.setState({
        reposNumber: remoteUser.public_repos,
        userFullName: remoteUser.name,
        userName: userName,
        userPic: remoteUser.avatar_url
      })
    } catch (e) {
      this.setState({
        error: `User ${userName} does not exist on GitHub :(`,
        userName: this.state.userName
       })
    }
  }

  fetchGithubRepos = async (userName) => {
    const {
      page,
      perPage
    } = this.state

    try {
      const remoteRepos = await getGithubRepos(userName, page, perPage)

      this.setState({
        isLoadingRepos: false,
        repos: remoteRepos
       })
    } catch (e) {}
  }

  handleSearchButton = () => {
    this.loadData(this.emailInputRef.value)

    this.toggleUserNameChangeModal()
  }

  handleChangePage = (e, page) => {
    this.setState({
      isLoadingRepos: true,
      page
     }, () => {
      this.fetchGithubRepos(this.state.userName)
    })
  };

  handleChangeRowsPerPage = e => {
    this.setState({
      isLoadingRepos: true,
      perPage: e.target.value
     }, () => {
      this.fetchGithubRepos(this.state.userName)
    })
  };

  render () {
    const { classes } = this.props

    const {
      error,
      isLoadingRepos,
      page,
      perPage,
      repos,
      reposNumber,
      showUserNameChangeModal,
      userFullName,
      userName,
      userPic,
     } = this.state

    const emptyRows = perPage - repos.length

    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              GitHub Repository Explorer
          </Typography>
          </Toolbar>
        </AppBar>
        {showUserNameChangeModal && (
          <Dialog aria-labelledby="form-dialog-title" onClose={this.toggleUserNameChangeModal} open={showUserNameChangeModal}>
            <DialogContent>
              <DialogContentText>
                <p>Enter GitHub username to find repositories.</p>
                <p>Some examples:</p>
                <ul>
                  <li>Addy Osmani (<b>addyosmani</b>)</li>
                  <li>Dan Abramov (<b>gaearon</b>)</li>
                </ul>
            </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="GitHub Username"
                inputRef={this.setEmailInputRef}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleUserNameChangeModal} color="primary">
                Cancel
            </Button>
              <Button onClick={this.handleSearchButton} color="primary">
                Search
            </Button>
            </DialogActions>
          </Dialog>
        )}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={5}>
            <Paper className={classes.paper}>
              <UserCard
                classes={classes}
                toggleModal={this.toggleUserNameChangeModal}
                userFullName={userFullName}
                userName={userName}
                userPic={userPic} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Paper className={classes.paper}>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <TableBody>
                    {isLoadingRepos ? (
                      <TableRow>
                        <TableCell>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : repos.map(r => {
                      return (
                        <TableRow key={r.id}>
                          <TableCell component="th" scope="row">
                            <Typography variant="subheading">{r.name}</Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <StarsIcon /><span style={{verticalAlign: 'super'}}><b>{r.stargazers_count}</b></span>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Button target="_blank" mini={true} variant="outlined" size="small" href={r.html_url}>
                              Browse
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 48 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={3}
                        count={reposNumber}
                        rowsPerPage={perPage}
                        page={page - 1}
                        rowsPerPageOptions={[10, 20, 50]}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </Paper>
          </Grid>
        </Grid>
        {error && <ErrorBar classes={classes} message={error} handleClose={this.handleClose} />}
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(Index))
