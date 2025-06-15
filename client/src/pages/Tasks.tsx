import {gql, useQuery, useMutation} from '@apollo/client';
import {useState} from 'react';
import { logout } from '../utils/auth';

interface Task {
    id: string;
    title: string;
    done: boolean;
}

interface GetTasksData {
    myTasks: Task[];
}

const GET_TASKS = gql`query { myTasks { id title done } }`;
const CREATE_TASK = gql`mutation($title: String!){ createTask(title: $title) {id title done} }`;
const DELETE_TASK = gql`mutation($id: ID!) { deleteTask(id: $id) }`


export const Tasks = () => {
    const {data, refetch} = useQuery<GetTasksData>(GET_TASKS);
    const [createTask] = useMutation(CREATE_TASK, { onCompleted: ()=> refetch });
    const [deleteTask] = useMutation(DELETE_TASK, { onCompleted: () => refetch()});
    const [title, setTitle] = useState('');

    const handleAddTask = () => {
        createTask({ variables: {title} }); 
        setTitle('');
    };

    return (
        <div>
            <h2>My tasks</h2>
            <button onClick={logout}>Exit</button>
            <input placeholder='New Task' value={title} onChange={e => setTitle(e.target.value)}/>
            <button onClick={handleAddTask}>Add</button>

            <ul>
                {data?.myTasks.map((task: Task) => (
                    <li key={task.id}>
                        {task.title}
                        <button onClick={()=>deleteTask({variables: {id: task.id}})}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
