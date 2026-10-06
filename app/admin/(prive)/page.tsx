import { loadData } from '../../../lib/admin/data';
import { Dashboard } from '../Views';
export default async function Page(){return <Dashboard data={await loadData()}/>;}
