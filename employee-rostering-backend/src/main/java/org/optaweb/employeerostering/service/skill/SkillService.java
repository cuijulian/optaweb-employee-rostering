/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.optaweb.employeerostering.service.skill;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.optaweb.employeerostering.domain.skill.Skill;
import org.optaweb.employeerostering.service.common.AbstractRestService;
import org.springframework.stereotype.Service;

@Service
public class SkillService extends AbstractRestService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional
    public List<Skill> getSkillList(Integer tenantId) {
        return skillRepository.findAllByTenantId(tenantId);
    }

    @Transactional
    public Skill getSkill(Integer tenantId, Long id) {
        Optional<Skill> skillOptional = skillRepository.findById(id);

        if (!skillOptional.isPresent()) {
            throw new EntityNotFoundException("No Skill entity found with ID (" + id + ").");
        }

        validateTenantIdParameter(tenantId, skillOptional.get());
        return skillOptional.get();
    }

    @Transactional
    public Boolean deleteSkill(Integer tenantId, Long id) {
        Optional<Skill> skillOptional = skillRepository.findById(id);

        if (!skillOptional.isPresent()) {
            throw new EntityNotFoundException("No Skill entity found with ID (" + id + ").");
        }

        validateTenantIdParameter(tenantId, skillOptional.get());
        skillRepository.deleteById(id);
        return true;
    }

    @Transactional
    public Skill createSkill(Integer tenantId, Skill skill) {
        validateTenantIdParameter(tenantId, skill);

        return skillRepository.save(skill);
    }

    @Transactional
    public Skill updateSkill(Integer tenantId, Skill skill) {
        validateTenantIdParameter(tenantId, skill);

        Optional<Skill> skillOptional = skillRepository.findById(skill.getId());

        if (!skillOptional.isPresent()) {
            throw new EntityNotFoundException("Skill entity with ID (" + skill.getId() + ") not found.");
        } else if (!skillOptional.get().getTenantId().equals(skill.getTenantId())) {
            throw new IllegalStateException("Skill entity with tenantId (" + skillOptional.get().getTenantId()
                    + ") cannot change tenants.");
        }

        Skill databaseSkill = skillOptional.get();
        databaseSkill.setName(skill.getName());
        return skillRepository.save(databaseSkill);
    }
}