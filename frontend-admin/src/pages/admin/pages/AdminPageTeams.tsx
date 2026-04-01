import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageTeams = () => {
    return <AdminPageContentEditor pageName="teams" pageTitle="Teams Page" sections={sectionConfig.teams || []} />;
};

export default AdminPageTeams;
