import { IComment } from 'app/models/movie';
import React, { KeyboardEvent, useState } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react';

interface IProps {
	comments: IComment[] | undefined;
	showModal: (username: string) => void;
}

const Comments: React.FC<IProps> = ({ comments, showModal }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [allComments, setAllComments] = useState(comments);
	const [comment, setComment] = useState('');

	const commentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const addComment = (value: string) => {
		// TODO add logic to add comments to movie in backend DB!
		// and make it return comment as in comments array!
		// Also Form has prop loading which could be used for loading indicator while making the add comment call

		/* const newComment: IComment = ...
		const commentsArray = !allComments ? [] : allComments;
		setAllComments([...commentsArray, newComment]);*/
		console.warn({ value, message: 'COMMENTINNG NOT IMPLEMENTED YET!' });
		setComment('');
	};

	const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (comment.length < 2 || /^\s+$/.test(comment)) return;
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addComment(comment);
		}
	};

	const getDateStr = (date: Date): string => {
		const now = new Date();
		const hours =
			date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
		const minutes =
			date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
		const month =
			date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`;
		const day = date.getDay() < 10 ? `0${date.getDay()}` : `${date.getDay()}`;
		if (date.getFullYear() === now.getFullYear()) {
			if (date.getMonth() === now.getMonth() && date.getDay() === now.getDay())
				return `Today ${hours}:${minutes}`;
			return `${day}.${month} ${hours}:${minutes}`;
		}
		return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
	};

	return (
		<Comment.Group style={{ maxWidth: '100%' }}>
			<Header as="h4">Comments:</Header>
			{!allComments && <p style={{ color: 'gray' }}>No comments...</p>}
			{allComments &&
				allComments.map(({ username, profilePicName, date, comment }) => (
					<Comment key={`${username}-${date.toString()}`}>
						<Comment.Avatar
							src={`http://localhost:8080/profileImages/${profilePicName}`}
						/>
						<Comment.Content>
							<Comment.Author as="a" onClick={() => showModal(username)}>
								{username}
							</Comment.Author>
							<Comment.Metadata>{getDateStr(date)}</Comment.Metadata>
							<Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
								{comment}
							</Comment.Text>
						</Comment.Content>
					</Comment>
				))}
			<Form style={{ marginTop: 20, textAlign: 'center' }}>
				<Form.TextArea
					placeholder="Write a comment"
					value={comment}
					onChange={commentChange}
					rows="2"
					onKeyDown={handleKey}
				/>
				<Button
					content="Add Comment"
					labelPosition="left"
					icon="edit"
					color="teal"
					disabled={comment.length < 2 || /^\s+$/.test(comment) ? true : false}
					onClick={() => addComment(comment)}
				/>
			</Form>
		</Comment.Group>
	);
};

export default Comments;
