const WaybillBodyModel = require('../models/waybill-body-models');


class WaybillBodyService {
    async getAllHeadersRecords(headerId) {
        const list = await WaybillBodyModel.findAll({ where: { waybillheaderid: headerId } });
        return list;
    }


    async createRecord(payload) {
        const data = await WaybillBodyModel.create(payload);
        return data;
    }

    async updateRecord(payload) {
        let record = await WaybillBodyModel.findOne({ where: { id: payload.id } });
        record.order = payload?.order || record.order;
        record.placeid = payload?.placeid || record.placeid;
        record.waybillheaderid = payload?.waybillheaderid || record.waybillheaderid;
        record.cargoid = payload?.cargoid || record.cargoid;
        record.classcargo = payload?.classcargo || record.classcargo;
        record.distance = payload?.distance || record.distance;
        record.count = payload?.count || record.count;
        record.weight = payload?.weight || record.weight;
        record.counttrips = payload?.counttrips || record.counttrips;
        return await record.save();
    }


    async removeRecord(recordId) {
        const record = await WaybillBodyModel.destroy({ where: { id: recordId } });
        return record;
    }
}

module.exports = new WaybillBodyService();