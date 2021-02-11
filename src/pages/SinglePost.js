import React, { useContext,useState } from 'react'
import gql from 'graphql-tag'
import {useQuery,useMutation} from '@apollo/client'
import { Grid,Card, Icon, Label, Image, Button,Form } from 'semantic-ui-react'
import moment from 'moment'
import {AuthContext} from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import { FETCH_POST_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'


const SUBMIT_COMMENT_MUTATION =gql`
    mutation createComment($postId: ID!, $body: String!){
        createComment(postId:$postId,body:$body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`


const SinglePost = (props) => {
    const postId = props.match.params.postId
    const { user } = useContext(AuthContext)

    const [comment,setComment] = useState('')
    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        errorPolicy: 'none',
        refetchQueries: [{ query: FETCH_POST_QUERY }],
        update() {
            setComment('')
        },
        variables: {
            postId,
            body:comment
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup
    if (!getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
        } = getPost

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton
                                    user={user}
                                    post={{id,likeCount,likes}}
                                />
                                <MyPopup content="Comment on post" >
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                    >
                                        <Button color='blue' basic>
                                            <Icon name='comment' style={{margin:0 }}/>
                                        </Button>
                                        <Label basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment.</p>
                                    <Form>
                                        <Form.Field>
                                            <div className="ui action input fluid">
                                                <input
                                                    type="text"
                                                    placeholder="Comment..."
                                                    name="comment"
                                                    value={comment}
                                                    onChange={e => setComment(e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="ui button blue"
                                                    disabled={comment.trimStart() === ""}
                                                    onClick={submitComment}
                                                >
                                                    <Icon name='comment' style={{margin:0 }}/>
                                                </button>
                                            </div>
                                        </Form.Field>    
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}

export default SinglePost
