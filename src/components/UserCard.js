import React from 'react'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'

export const UserCard = ({
  classes,
  toggleModal,
  userFullName,
  userName,
  userPic
}) => (
  <Card className={classes.card}>
    <div className={classes.details}>
      <CardContent className={classes.content}>
        <Typography variant="headline">{userFullName}</Typography>
        <Typography variant="subheading" color="textSecondary">{userName}</Typography>
        <Button onClick={toggleModal} color="secondary" aria-label="edit" className={classes.button}>
          Change User
        </Button>
      </CardContent>
    </div>
    <CardMedia
      className={classes.cover}
      image={userPic}
      src="image"
    />
  </Card>
)
