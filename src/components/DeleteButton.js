import React,{useState} from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import {FETCH_POSTS_QUERY,FETCH_POST_QUERY} from '../util/graphql'
import MyPopup from '../util/MyPopup'

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId: $postId )
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId:$postId,commentId:$commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

const DeleteButton = ({ postId, commentId, callback }) => {

    const [confirmOpen, setConfirmOpen] = useState(false)
    
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],
        update() {
            setConfirmOpen(false)
            if(callback) callback()
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors)
            console.log(err.networkError[0].extensions.exception.errors)
        },
        variables: {
            postId
        }
    })

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        errorPolicy: 'none',
        refetchQueries: [{ query: FETCH_POST_QUERY }],
        update() {
            setConfirmOpen(false)
            if(callback) callback()
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors)
            console.log(err.networkError[0].extensions.exception.errors)
        },
        variables: {
            postId, commentId
        }
    })

    return (
        <>
            <MyPopup
                content={commentId ? 'Delete comment': 'Delete post'}
            >
                <Button
                    as='div'
                    color='violet'
                    onClick={() => setConfirmOpen(true)}
                    floated="right"
                >
                    <Icon name='trash' style={{margin:0 }}/>
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={commentId ? deleteComment : deletePost}
            />
        </>
    )
}

export default DeleteButton
