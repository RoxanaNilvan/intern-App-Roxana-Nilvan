import { useEffect, useState } from 'react';
import { currentEnvironment } from '@constants';
import styles from './users.module.scss';

type Gender = 'female' | 'male' | '';

type User = {
    gender: Gender;
    login: {
        uuid: string;
    };
    name: {
        first: string;
        last: string;
    };
};

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [gender, setGender] = useState<Gender>('');
    const [pageToGet, setPageToGet] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const getUsers = async (page: number, gender: Gender) => {
        setLoading(true);
        let url = `${currentEnvironment.api.baseUrl}?results=5&page=${String(page)}`;
        if (gender) {
            url += `&gender=${gender}`;
        }

        try {
            const result = await fetch(url);
            const data = await result.json();
            const usersResults = data.results as User[];

            setUsers((oldUsers) => (page === 1 ? usersResults : [...oldUsers, ...usersResults]));
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers(pageToGet, gender);
    }, [pageToGet, gender]);

    return (
        <div>
            <div style={{ backgroundColor: 'grey', padding: '10px' }}>
                <h2>Users</h2>
                <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(event) => {
                        setGender(event.target.value as Gender);
                        setPageToGet(1); // Reset page number when gender changes
                    }}
                >
                    <option value="">All</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.length > 0 ? (
                        users.map((user: User) => (
                            <li key={user.login.uuid}>
                                {user.name.first} {user.name.last} ({user.gender})
                            </li>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </ul>
            )}
            <button
                className={styles.loadButlon}
                type="button"
                onClick={() => {
                    setPageToGet((v) => v + 1);
                }}
            >
                Load More
            </button>
        </div>
    );
};

export default Users;
