import { IComment } from 'app/models/movie';
import React, { KeyboardEvent, useState } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react';

interface IProps {
	comments: IComment[];
	createComment: (comment: string) => Promise<void>;
	showModal: (username: string) => void;
}

const Comments: React.FC<IProps> = ({ comments, createComment, showModal }) => {
	const [comment, setComment] = useState('');
	const [loading, setLoading] = useState(false);

	const commentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const addComment = () => {
		setLoading(true);
		createComment(comment)
			.then(() => setComment(''))
			.finally(() => setLoading(false));
	};

	const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (comment.length < 2 || /^\s+$/.test(comment)) return;
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addComment();
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
			{!comments.length && <p style={{ color: 'gray' }}>No comments...</p>}
			{comments.map(({ username, profilePicName, timestamp, text }) => (
				<Comment key={`${username}-${new Date(timestamp).toString()}`}>
					<Comment.Avatar
						src={`http://localhost:8080/profileImages/${
							profilePicName ?? 'blank-profile.png'
						}`}
					/>
					<Comment.Content>
						<Comment.Author as="a" onClick={() => showModal(username)}>
							{username}
						</Comment.Author>
						<Comment.Metadata>
							{getDateStr(new Date(timestamp))}
						</Comment.Metadata>
						<Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
							{text}
						</Comment.Text>
					</Comment.Content>
				</Comment>
			))}
			<Form style={{ marginTop: 20, textAlign: 'center' }} loading={loading}>
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
					onClick={() => addComment()}
				/>
			</Form>
		</Comment.Group>
	);
};

export default Comments;
