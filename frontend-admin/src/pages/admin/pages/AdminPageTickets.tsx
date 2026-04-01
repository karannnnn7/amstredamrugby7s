import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageTickets = () => {
    return <AdminPageContentEditor pageName="tickets" pageTitle="Tickets Page" sections={sectionConfig.tickets || []} />;
};

export default AdminPageTickets;
