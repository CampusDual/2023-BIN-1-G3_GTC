package com.ontimize.backendG3.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IScanService {

    public EntityResult scanQuery(Map<?, ?> keyMap, List<?> attrList);
    public EntityResult scanInsert(Map<?, ?> attrMap);
    public EntityResult scanUpdate(Map<?, ?> attrMap, Map<?, ?> keyMap);
    public EntityResult scanDelete(Map<?, ?> keyMap);
}
