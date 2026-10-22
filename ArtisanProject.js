import React,{ useState,useEffect, act, use } from 'react';
import styles from './ArtisanProjects.module.scss';
import { elementor } from 'fontawesome';

function RawNeeded({loadData,activeDB,fetchDB,crafts,raws,perProject,Filtering, handleInputChange,bank}){
    const [filter,setFilter] = useState('');
    const [displayData,setDisplayData] = useState([])
    useEffect(() =>{
        let result = raws

        if(!perProject){
            const merged = new Map()

            raws.forEach(raw => {
                const key = `${raw.item_id}_${raw.rarity}`
                if(merged.has(key)){
                    merged.get(key).quantity += raw.quantity
                } 
                else{
                    merged.set(key,{...raw})
                }
            });
            
            result = Array.from(merged.values())
        }

        const filtered = Filtering(result,filter)
        setDisplayData(filtered)
    },[raws,perProject,filter])

    return(
        <div className="centered-pages">
            <div style={{width: '80%'}} className="card">
                <h2 className={styles.padded}>Raw mats needed</h2>
                <div className={styles.padded} style={{ padding:'20px'}}>
                    <label className={styles.padded}>Search for item</label>
                    <input
                        type="text"
                        placeholder="Search for item"
                        value={filter}
                        onChange={(e) => handleInputChange(e,setFilter)}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            width: '50%',
                        }}
                    />
                </div>
                <table className="data-table">
                    <tbody>
                    <tr>
                        <td><h1>Name</h1></td>
                        <td><h1>Project Name</h1></td>
                        <td><h1>Rarity</h1></td>
                        <td><h1>Quantity</h1></td>
                        <td></td>
                    </tr>
                        {displayData.map((element,index) =>{
                            const fullraw = activeDB.find(i => i.id == element.item_id)  
                            const project = crafts.find(i => i.id == element.project_id) 
                            const fullproject = activeDB.find(i => i.id == project.item_id)  
                            const itemInBank = bank.find(i=>i.item_id==element.item_id)
                            let bankAmount = 0
                            if(itemInBank){
                                bankAmount = itemInBank.amount
                            }
                            return( 
                                <tr key={index}>
                                    <td>{fullraw.name}</td>
                                    <td>{fullproject.name}</td>
                                    <td>{element.rarity}</td>
                                    <td>{bankAmount}/{element.quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ProcNeeded({loadData,activeDB,fetchDB,crafts,procs,perProject,Filtering,handleInputChange,bank}){
    const [filter,setFilter] = useState('');
    const [displayData,setDisplayData] = useState([])
    const [expanded,setExpanded] = useState({})

    useEffect(() =>{
        let result = procs

        if(!perProject){
            const merged = new Map()

            procs.forEach(raw => {
                const key = `${raw.item_id}_${raw.rarity}`
                if(merged.has(key)){
                    merged.get(key).quantity += raw.quantity
                } 
                else{
                    merged.set(key,{...raw})
                }
            });
            
            result = Array.from(merged.values())
        }

        const filtered = Filtering(result,filter)
        setDisplayData(filtered)
    },[procs,perProject,filter])

    function toggleExpand(id){
        setExpanded(prev =>({...prev,[id]:!prev[id]}))
    }

    function getChildren(id){
        return displayData.filter(c => c.toplevelid == id)
    }

    return(
        <div className="centered-pages">
            <div style={{width: '80%'}} className="card">
                <h2 className={styles.padded}>Processing needed</h2>
                <div className={styles.padded} style={{ padding:'20px'}}>
                    <label className={styles.padded}>Search for item</label>
                    <input
                        type="text"
                        placeholder="Search for item"
                        value={filter}
                        onChange={(e) => handleInputChange(e,setFilter)}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            width: '50%',
                        }}
                    />
                </div>
                <table className="data-table">
                    <tbody>
                    <tr>
                        <td><h1>Name</h1></td>
                        <td><h1>Project Name</h1></td>
                        <td><h1>Rarity</h1></td>
                        <td><h1>Quantity</h1></td>
                        <td><h1>Profession</h1></td>
                        <td></td>
                    </tr>
                        {displayData.map((element, index) => {
                            if (element.toplevel !== 0) {
                                const fullproc = activeDB.find(i => i.id === element.item_id);
                                const project = crafts.find(i => i.id === element.project_id);
                                const fullproject = activeDB.find(i => i.id === project?.item_id);
                                const itemInBank = bank.find(i=>i.item_id==element.item_id)
                                let bankAmount = 0
                                if(itemInBank){
                                    bankAmount = itemInBank.amount
                                }

                                const isExpanded = expanded[element.id]; // Make sure you track expansion state
                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td>{fullproc?.name}</td>
                                            <td>{fullproject?.name}</td>
                                            <td>{element.rarity}</td>
                                            <td>{bankAmount}/{element.quantity}</td>
                                            <td>{fullproc?.profession}</td>
                                            <td>
                                                <button onClick={() => toggleExpand(element.id)}>
                                                    {isExpanded ? '−' : '+'}
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && getChildren(element.id).map((child, childIndex) => {
                                            const childProc = activeDB.find(i => i.id === child.item_id);
                                            const childProject = crafts.find(i => i.id === child.project_id);
                                            const fullChildProject = activeDB.find(i => i.id === childProject?.item_id);
                                            const itemInBank = bank.find(i=>i.id==element.item_id)
                                            let bankAmount = 0
                                            if(itemInBank){
                                                bankAmount = itemInBank.amount
                                            }

                                            return (
                                                <tr key={`child-${index}-${childIndex}`} style={{ backgroundColor: "grey" }}>
                                                    <td style={{ paddingLeft: '40px' }}>↳ {childProc?.name}</td>
                                                    <td>{fullChildProject?.name}</td>
                                                    <td>{child.rarity}</td>
                                                    <td>{bankAmount}/{child.quantity}</td>
                                                    <td>{childProc?.profession}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function CraftNeeded({loadData,activeDB,fetchDB,crafts,Filtering,handleInputChange,bank}){
    const [filter,setFilter] = useState('');
    const [displayData,setDisplayData] = useState([])
    useEffect(() =>{
        let result = crafts

        const filtered = Filtering(result,filter)
        setDisplayData(filtered)
    },[crafts,filter])

    return(
        <div className="centered-pages">
            <div style={{width: '80%'}} className="card">
                <h2 className={styles.padded}>Crafting needed</h2>
                <div className={styles.padded} style={{ padding:'20px'}}>
                    <label className={styles.padded}>Search for item</label>
                    <input
                        type="text"
                        placeholder="Search for item"
                        value={filter}
                        onChange={(e) => handleInputChange(e,setFilter)}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            width: '50%',
                        }}
                    />
                </div>
                <table className="data-table">
                    <tbody>
                    <tr>
                        <td><h1>Name</h1></td>
                        <td><h1>Rarity</h1></td>
                        <td><h1>Quantity</h1></td>
                        <td><h1>Profession</h1></td>
                        <td></td>
                    </tr>
                        {displayData.map((element,index) =>{
                            if(element.status == "deleted"){
                                return null
                            }

                            const fullcraft = activeDB.find(i => i.id == element.item_id)  
                            const itemInBank = bank.find(i=>i.id==element.item_id)
                            let bankAmount = 0
                            if(itemInBank){
                                bankAmount = itemInBank.amount
                            }
                            return(
                                <tr key={index}>
                                    <td>{fullcraft.name}</td>
                                    <td>{element.rarity}</td>
                                    <td>{bankAmount}/{element.quantity}</td>
                                    <td>{fullcraft.profession}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const ArtisanProject =({currentUser,dbCall,fetchDB,setMenu,memberViewOn, activeRoles}) =>
{
    const [activeDB,setActiveDB] = useState([])
    const [raws,setRaws] = useState([])
    const [procs,setProcs] = useState([])
    const [crafts,setCrafts] = useState([])
    const [perProject,setPerProject] = useState(false)
    const [bank,setBank] = useState([])
    
    function Filtering(data,filter){

        const filtered = data.filter(item => {
            const full = activeDB.find(i => i.id == item.item_id)
            if(!full || !full.name) return false

            if(full.profession){
                return(full.name.toLowerCase().includes(filter) || full.profession.toLowerCase().includes(filter))
            }
            else{
                return(full.name.toLowerCase().includes(filter))
            }
            
        })   
        return filtered;
    }

    const loadData = async (table, setter) => {
        const data = await fetchDB(table);
        if(setter) setter(data);
        return (data)
    };


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchDB("items");
            setActiveDB(data);
        };
        loadData();
    }, []);

    useEffect(() => {
        loadData("projectproc", setProcs);
        loadData("projectraw", setRaws);
        loadData("projects", setCrafts);
        loadData("bank",setBank)
    }, []);

    const handlePerProjectChange = (event) =>{
        setPerProject(event.target.checked)
    }

    const handleInputChange = (e,setFilter) => {
        const value = e.target.value.toLowerCase();
        setFilter(value);
    };

    return(
        <div>
            <div className="centered-pages">
                <div className='card' style={{width: '80%', padding:'20px'}}> 
                    {(activeRoles?.find(r => r.id == currentUser?.role_id).name == "Admin" || activeRoles?.find(r => r.id == currentUser?.role_id).name == "Bank") && !memberViewOn &&
                    <div style={{ padding:'20px'}}>
                        <button
                        onClick={() => setMenu("manageprojects")}
                        >
                        Manage Projects
                        </button>
                    </div>
                    }
                    <div style={{ padding:'20px'}}>
                        <label>Show items per project</label>
                        <input type='checkbox' checked={perProject} onChange={handlePerProjectChange} style={{width:'200px'}}></input>
                    </div>
                </div>
            </div>
            <div>
                {activeDB.length > 0 && crafts.length > 0 && raws.length > 0 && (
                    <RawNeeded loadData={loadData} activeDB={activeDB} fetchDB={fetchDB} crafts={crafts} raws={raws} perProject={perProject} Filtering={Filtering} handleInputChange={handleInputChange} bank={bank}/>
                )}
                {activeDB.length > 0 && crafts.length > 0 && procs.length > 0 && activeRoles?.find(r => r.id == currentUser?.role_id).name == "Admin" && !memberViewOn && (
                    <ProcNeeded loadData={loadData} activeDB={activeDB} fetchDB={fetchDB} crafts={crafts} procs={procs} perProject={perProject} Filtering={Filtering} handleInputChange={handleInputChange} bank={bank}/>
                )}
                {activeDB.length > 0 && crafts.length > 0 && activeRoles?.find(r => r.id == currentUser?.role_id).name == "Admin" && !memberViewOn && (
                    <CraftNeeded loadData={loadData} activeDB={activeDB} fetchDB={fetchDB} crafts={crafts} Filtering={Filtering} handleInputChange={handleInputChange} bank={bank}/>
                )}
            </div>
        </div>
    )

}
export default ArtisanProject;