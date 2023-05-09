import { DatePicker, Button, Space, Table, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useParams } from "react-router";
import OrganizationService from "../../../api/services/organization-service";
import IndividualService from "../../../api/services/individuals-service";
import MechanicsService from "../../../api/services/mechanics-service";
import CargoService from "../../../api/services/cargo-service";
import WaybillheaderService from "../../../api/services/waybill-header-service";
import WaybillBodyService from "../../../api/services/waybill-body-service";
import { WaybillBodyDialog } from "../../../components/dialogs/waybill-body-dialog/WaybillBodyDialog";
import PlaceService from "../../../api/services/place-service";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import TechniqueService from "../../../api/services/technique-service";

const { Option } = Select;

export const WayyBillView = ({
    ...props
}) => {
    const columns = [
        {
            title: 'Код',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ответственное подразделение',
            dataIndex: 'order',
            key: 'id'
        },
        {
            title: 'Место',
            key: 'title',
            render: (text, record) => places.find(it=> it.id === record.placeid)?.title,
        },
        {
            title: 'Наименование груза',
            key: 'title',
            render: (text, record) => cargos.find(it => it.id === record.cargoid)?.title,
        },
        {
            title: 'Тип груза',
            dataIndex: 'classcargo',
        },
        {
            title: 'Расстояние',
            dataIndex: 'distance',
        },
        {
            title: 'Количество',
            dataIndex: 'count',
        },
        {
            title: 'Вес',
            dataIndex: 'weight',
        },
        {
            title: 'Количество поездок',
            dataIndex: 'counttrips',
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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const { id } = useParams();
    const [waybill, setWaybill] = useState(null);
    const [list, setList] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [places, setPlacec] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [techniques, setTechniques] = useState([]);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(async () => {
        const waybill = await WaybillheaderService.getOneRecord(id);
        const list = await WaybillBodyService.getAllHeadersRecords(id);
        const individuals = await IndividualService.getAllRecords();
        const organizations = await OrganizationService.getAllRecords();
        const cargos = await CargoService.getAllRecords();
        const places = await PlaceService.getAllRecords();
        const mechanics = await MechanicsService.getAllRecords();
        const techniques = await TechniqueService.getAllRecords();
        setList(list);
        setWaybill(waybill);

        setIndividuals(individuals);
        setOrganizations(organizations);
        setCargos(cargos);
        setMechanics(mechanics);
        setPlacec(places);
        setTechniques(techniques);


        return () => {
            setList([]);
            setWaybill(null);

            setIndividuals([]);
            setOrganizations([]);
            setCargos([]);
            setMechanics([]);
            setPlacec([]);
            setTechniques([]);

        };
    }, []);

    const createRecordHandler = () => {
        setCurrentRecord(null)
        setVisible(true);
    }
    const updateRecordHandler = (record) => {
        setCurrentRecord(record)
        setVisible(true)
    }
    const deleteRecordHandler = async (recordId) => {
        await WaybillBodyService.removeRecord(recordId);
        setList(list.filter(it => it.id !== recordId));
    }

    return (
        <div style={{ padding: 16 }}>
            <div ref={componentRef}>

                <Space
                    direction={'vertical'}
                    align={'center'}
                    style={{ width: '100%', marginBottom: 24 }}
                >
                    <h2>Путевой лист № <strong>{waybill?.number}</strong></h2>
                
                   <Space
                   >Дата выписки    
                    <DatePicker  
                        format="YYYY-MM-DD"
                        value={moment(waybill?.dischargeDate) || null}
                        onChange={date => setWaybill({ ...waybill, dischargeDate: date },WaybillheaderService.updateRecord({
                            ...waybill, dischargeDate: date
                        }))
                        }
                        style={{ width: 232}}
                    />
                    </Space> 

                    <Space>Путевой лист выдан: <strong>
                        <Select
                            value={waybill?.organizationId || null}
                            onChange={value => setWaybill({ ...waybill, organizationId: value },WaybillheaderService.updateRecord({
                                ...waybill, organizationId: value
                            }))
                            }
                            placeholder={"Выберите организацию"}
                            style={{ width: 425 }}
                        >  
                        {organizations.map(it => <Option
                            value={it.id}>
                            {it.title}
                        </Option>)}
                        </Select>
                    </strong></Space>

                    <Space>Тракторист: <strong>
                        <Select
                            value={waybill?.tractordriversid || null}
                            onChange={value => setWaybill({ ...waybill, tractordriversid: value },WaybillheaderService.updateRecord({
                                ...waybill, tractordriversid: value
                            }))
                            }
                            placeholder={"Выберите тракториста"}
                            style={{ width: 425 }}
                            >
                            {individuals.map(it => <Option
                                value={it.id}>
                                {it.lastName} {it.firstName} {it.patronymic}
                            </Option>)}
                        </Select>
                        </strong></Space>
                    <Space>Механик: <strong>
                        <Select
                            value={waybill?.mechanicsid || null}
                            onChange={value => setWaybill({ ...waybill, mechanicsid: value },WaybillheaderService.updateRecord({
                                ...waybill, mechanicsid: value
                            }))
                            }
                            placeholder={"Выберите механика"}
                            style={{ width: 425 }}
                            >
                            {mechanics.map(it => <Option
                                value={it.id}>
                                {it.lastName} {it.firstName} {it.patronymic}
                            </Option>)}
                        </Select>
                        </strong></Space>
                    <Space>Трактор: <strong>
                        <Select
                            value={waybill?.technicsid || null}
                            onChange={value => setWaybill({ ...waybill, technicsid: value },WaybillheaderService.updateRecord({
                                ...waybill, technicsid: value
                            }))
                            }
                            placeholder={"Выберите трактор"}
                            style={{ width: 425 }}
                            >
                            {techniques.map(it => <Option
                                value={it.id}>
                                {it.title}
                            </Option>)}
                        </Select>
                        </strong></Space>
                </Space>

                <Table dataSource={list} columns={columns} />
            </div>

            <Space>
                <Button onClick={createRecordHandler}>
                    Создать
                </Button>
                <Button type="dashed" onClick={handlePrint}>
                    Печать
                </Button>
            </Space>

            <WaybillBodyDialog
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
                waybillheaderid={id}
                cargos={cargos}
                places={places}
            />
        </div>
    )
}