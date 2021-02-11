import React,{useContext} from 'react'
import { Card, Icon, Label, Image, Button} from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'


const PostCard = ({ post: { body, createdAt, id, username, likeCount, commentCount, likes, comments } }) => {
    
    const { user } = useContext(AuthContext)
    const commentUsers = []
    comments.map(user => commentUsers.push(user.username))
    const newUsers = [...new Set(commentUsers)]

    return (
        <Card>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{id,likes,likeCount}} />
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <MyPopup
                        content="Comment on post"
                    >
                        <Button color='blue' basic>
                            <Icon name='comment' style={{margin:0 }}/>
                        </Button>
                    </MyPopup>
                    <MyPopup
                        content={newUsers.map((user,i) => <p key={i}>{user}</p>)}
                    >
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </MyPopup>
                </Button>
                {user && user.username === username && <DeleteButton postId={id}/>}
            </Card.Content>
        </Card>
    )
}

export default PostCard
