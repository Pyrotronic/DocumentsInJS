import { Input, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect } from "react";
import { useState } from "react";
import { Select } from 'antd';
import WaybillBodyService from "../../../api/services/waybill-body-service";

const { Option } = Select;

export const WaybillBodyDialog = ({
    visible,
    onOk,
    onCancel,
    currentRecord,
    cargos,
    waybillheaderid,
    places,
    ...props
}) => {
    const [waybillBody, setWaybillBody] = useState(null);

    useEffect(() => {
        if (currentRecord) {
            setWaybillBody(currentRecord);
        } else {
            setWaybillBody(null);
        }
    }, [currentRecord])

    const onOkHandler = async () => {
        const record =
            currentRecord
                ? await WaybillBodyService.updateRecord({
                    id: currentRecord.id,
                    ...waybillBody,
                })
                : await WaybillBodyService.createRecord({ ...waybillBody, waybillheaderid })
        onOk(record);
    }

    return (
        <Modal
            visible={visible}
            title={currentRecord ? 'Редактировать' : 'Создать'}
            onOk={onOkHandler}
            onCancel={onCancel}
        >
            <Space direction="vertical">

                <Select
                    value={waybillBody?.placeid || null}
                    onChange={value => setWaybillBody({ ...waybillBody, placeid: value })}
                    placeholder={"Выберите место"}
                    style={{ width: '100%' }}
                >
                    {places.map(it => <Option
                        value={it.id}>
                        {it.title}
                    </Option>)}
                </Select>
                <Select
                    value={waybillBody?.cargoid || null}
                    onChange={value => setWaybillBody({ ...waybillBody, cargoid: value })}
                    placeholder={"Выберите груз"}
                    style={{ width: '100%' }}
                >
                    {cargos.map(it => <Option
                        value={it.id}>
                        {it.title}
                    </Option>)}
                </Select>


                <Space>

                    <Input
                        value={waybillBody?.order || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, order: e.target.value })}
                        placeholder="Укажите ответственное подразделение"
                    />

                    <Input
                        value={waybillBody?.classcargo || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, classcargo: e.target.value })}
                        placeholder="Укажите тип груза"
                    />
                </Space>
                <Space>
                    <Input
                        value={waybillBody?.distance || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, distance: e.target.value })}
                        placeholder="Укажите расстояние"
                    />
                    <Input
                        value={waybillBody?.count || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, count: e.target.value })}
                        placeholder="Укажите количество"
                    />
                </Space>
                <Space>
                    <Input
                        value={waybillBody?.weight || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, weight: e.target.value })}
                        placeholder="Укажите вес"
                    />
                    <Input
                        value={waybillBody?.counttrips || ''}
                        onChange={e => setWaybillBody({ ...waybillBody, counttrips: e.target.value })}
                        placeholder="Укажите количество поездок"
                    />
            
                </Space>

            </Space>

        </Modal>
    )
}
