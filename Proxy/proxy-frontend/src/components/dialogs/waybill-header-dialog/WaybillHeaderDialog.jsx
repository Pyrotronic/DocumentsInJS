import { DatePicker, Input, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { Select } from "antd";
import WaybillheaderService from "../../../api/services/waybill-header-service";

const { Option } = Select;

export const WaybillHeaderDialog = ({
    visible,
    onOk,
    onCancel,
    currentRecord,
    individuals,
    organizations,
    techniques,
    mechanics,
    ...props
}) => {
    const [waybillHeader, setWaybillHeader] = useState(null);

    useEffect(() => {
        if (currentRecord) {
            setWaybillHeader(currentRecord);
        } else {
            setWaybillHeader(null);
        }
    }, [currentRecord]);

    const onOkHandler = async () => {
        const record = currentRecord
            ? await WaybillheaderService.updateRecord({
                id: currentRecord.id,
                ...waybillHeader,
            })
            : await WaybillheaderService.createRecord(waybillHeader);
        onOk(record);
    };

    return (
        <Modal
            visible={visible}
            title={currentRecord ? "Редактировать" : "Создать"}
            onOk={onOkHandler}
            onCancel={onCancel}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Input
                    value={waybillHeader?.number || ""}
                    onChange={(e) =>
                        setWaybillHeader({ ...waybillHeader, number: e.target.value })
                    }
                    placeholder="Укажите номер документа"
                />
                <DatePicker
                        value={waybillHeader?.dischargeDate}
                        onChange={(date) =>
                            setWaybillHeader({ ...waybillHeader, dischargeDate: date })
                        }
                        placeholder={"Укажите дату выписки"}
                        style={{ width: 232 }}
                    />

                <Space style={{ width: "100%" }}>
                <Select
                        value={waybillHeader?.tractordriversid || null}
                        onChange={(value) =>
                            setWaybillHeader({ ...waybillHeader, tractordriversid: value })
                        }
                        placeholder={"Выберите тракториста"}
                        style={{ width: 232 }}
                    >
                        {individuals.map((it) => (
                            <Option value={it.id}>{it.lastName}</Option>
                        ))}
                    </Select>

                    <Select
                        value={waybillHeader?.mechanicsid || null}
                        onChange={(value) =>
                            setWaybillHeader({ ...waybillHeader, mechanicsid: value })
                        }
                        placeholder={"Выберите механика"}
                        style={{ width: 232 }}
                    >
                        {mechanics.map((it) => (
                            <Option value={it.id}>{it.lastName}</Option>
                        ))}
                    </Select>

                </Space>

                <Space style={{ width: "100%" }}>
                  
                   

                    <Select
                        value={waybillHeader?.organizationId || null}
                        onChange={(value) =>
                            setWaybillHeader({ ...waybillHeader, organizationId: value })
                        }
                        placeholder={"Выберите организацию"}
                        style={{ width: 232 }}
                    >
                        {organizations.map((it) => (
                            <Option value={it.id}>{it.title}</Option>
                        ))}
                    </Select>

                    <Select
                        value={waybillHeader?.technicsid || null}
                        onChange={(value) =>
                            setWaybillHeader({ ...waybillHeader, technicsid: value })
                        }
                        placeholder={"Выберите трактор"}
                        style={{ width: 232 }}
                    >
                        {techniques.map((it) => (
                            <Option value={it.id}>{it.title}</Option>
                        ))}
                    </Select>
                </Space>
            </Space>
        </Modal>
    );
};