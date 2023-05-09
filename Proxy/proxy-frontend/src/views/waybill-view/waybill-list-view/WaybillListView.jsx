import { Space, Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react";
import IndividualService from "../../../api/services/individuals-service";
import OrganizationService from "../../../api/services/organization-service";
import WaybillheaderService from "../../../api/services/waybill-header-service";
import MechanicsService from "../../../api/services/mechanics-service";
import { WaybillHeaderDialog } from "../../../components/dialogs/waybill-header-dialog/WaybillHeaderDialog";
import TechniqueService from "../../../api/services/technique-service";
import { useNavigate } from "react-router-dom";



export const WaybillListView = ({
        ...props
}) => {
    const columns = [
        {
            title: 'Код',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Дата выписки',
            dataIndex: 'dischargeDate',
        },
        {
            title: 'Тракторист',
            dataIndex: 'tractordrivers',
            render: (text, record) => individuals.find(it => it.id === record.tractordriversid)?.lastName,
        },
        {
            title: 'Механик',
            dataIndex: 'mechanicsid',
            render: (text, record) => mechanics.find(it => it.id === record.mechanicsid)?.lastName,
        },
        {
            title: 'Организация',
            dataIndex: 'organizationId',
            render: (text, record) => organizations.find(it => it.id === record.organizationId)?.title,
        },
        {
            title: 'Трактор',
            dataIndex: 'technicsid',
            render: (text, record) => techniques.find(it => it.id === record.technicsid)?.title,
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => {
                return (
                    <Space size="middle">
                        <div onClick={() => updateRecordHandler(record)}>
                            <EditOutlined />
                        </div>
                        <div onClick={() => deleteRecordHandler(record.id)}>
                            <DeleteOutlined />
                        </div>
                    </Space>
                )
            }
        }
    ];

    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [visible, setVisible] = useState(false);

    const [individuals, setIndividuals] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [techniques, setTechniques] = useState([]);
    const [mechanics, setMechanics] = useState([]);

    useEffect(async () => {
        const individuals = await IndividualService.getAllRecords();
        const organizations = await OrganizationService.getAllRecords();
        const techniques = await TechniqueService.getAllRecords();
        const mechanics = await MechanicsService.getAllRecords();
        const list = await WaybillheaderService.getAllRecords();
        setIndividuals(individuals);
        setOrganizations(organizations);
        setTechniques(techniques);
        setMechanics(mechanics);
        setList(list);
        return () => setList([]);
    }, []);

    const createRecordHandler = () => {
        setCurrentRecord(null)
        setVisible(true);
    }

    const updateRecordHandler = (record) => {
        setCurrentRecord(record)
        setVisible(true)
    }

    const deleteRecordHandler = async(recordId) => {
        await WaybillheaderService.removeRecord(recordId);
        setList(list.filter(it => it.id !== recordId));
    }

    return (
        <div style={{padding: 16}}>
            <Table
                dataSource={list}
                columns={columns}
                onRow={(record, rowIndex) => ({
                    onDoubleClick: event => {
                        navigate(`/waybill/${record.id}`)
                    },
                })}
             />
            <Button onClick={createRecordHandler}>  Создать </Button>
            <WaybillHeaderDialog
                visible={visible}
                onOk={(record) => {
                    currentRecord
                        ? setList(list.map(it => it.id === currentRecord.id
                            ? { ...record }
                            : it))
                        : setList([...list, record]);
        
                    setCurrentRecord(null);
                    setVisible(false);
                }}
                onCancel={() => setVisible(false)}
                currentRecord={currentRecord}
                individuals={individuals}
                organizations={organizations}
                techniques={techniques}  
                mechanics={mechanics}   
            />
        </div>
    )
}