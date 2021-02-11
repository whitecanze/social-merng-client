import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Icon, Label, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import MyPopup from '../util/MyPopup'


const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
        id
        likes {
            id
            username
        }
        likeCount
        }
    }
`;
const LikeButton = ({ user,post: { id, likeCount, likes } }) => {
    
    const [Liked, setLiked] = useState(false)

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION , {
        variables: { postId: id }
    });

    const likeButton = user ? (
        Liked ? (
            <Button color='olive'>
                <Icon name='thumbs up outline' style={{margin:0 }}/>
            </Button>
        ) : (
            <Button color='olive' basic>
                <Icon name='thumbs up outline' style={{margin:0 }}/>
            </Button>
        )
    ): (
        <Button as={Link} to="/login" color='olive' basic>
            <Icon name='thumbs up outline' style={{margin:0 }}/>
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            <MyPopup
                content={likes.map((user,i) => <p key={i}>{user.username}</p>)}
            >
                <Label basic color='olive' pointing='right'>
                    {likeCount}
                </Label>
            </MyPopup>
            <MyPopup content={Liked? 'Unlike': 'Like'}>
                {likeButton}
            </MyPopup>
        </Button>
    )
}

export default LikeButton
