import ProfileForm from '../components/ProfileForm/ProfileForm';
import Header from '../components/Header/Header';
import './ProfilePage.css';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <Header />
            <div className="profile-content">
                <ProfileForm />
            </div>
        </div>
    );
};

export default ProfilePage; 