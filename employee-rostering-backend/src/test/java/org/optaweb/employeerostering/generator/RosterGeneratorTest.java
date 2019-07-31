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

package org.optaweb.employeerostering.generator;

import javax.transaction.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.optaweb.employeerostering.BaseTest;
import org.optaweb.employeerostering.domain.contract.Contract;
import org.optaweb.employeerostering.domain.skill.Skill;
import org.optaweb.employeerostering.service.contract.ContractService;
import org.optaweb.employeerostering.service.roster.RosterGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.util.NestedServletException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class RosterGeneratorTest {

    private static final Logger logger = LoggerFactory.getLogger(RosterGeneratorTest.class);

    @Autowired
    private MockMvc mvc;

    private String skillPathURI = "http://localhost:8080/rest/tenant/{tenantId}/skill/";
    private String spotPathURI = "http://localhost:8080/rest/tenant/{tenantId}/spot/";
    private String contractPathURI = "http://localhost:8080/rest/tenant/{tenantId}/contract/";
    private String employeePathURI = "http://localhost:8080/rest/tenant/{tenantId}/employee/";
    private String rotationPathURI = "http://localhost:8080/rest/tenant/{tenantId}/rotation/";

    @BeforeClass
    public static void setup() {
        RosterGenerator rosterGenerator = mock(RosterGenerator.class);
        rosterGenerator.setUpGeneratedData();
    }

    @Test
    public void getSkillListTest() throws Exception {
        /*ResponseEntity<List<Skill>> response = getSkills(2937);
        ResponseEntity<List<Skill>> response2 = getSkills(5466);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().get(0).getName()).isEqualTo("Electrical");
        assertThat(response.getBody().get(1).getName()).isEqualTo("Mechanical");

        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response2.getBody().get(0).getName()).isEqualTo("Armed");
        assertThat(response2.getBody().get(1).getName()).isEqualTo("Martial art");*/

        mvc.perform(MockMvcRequestBuilders
                            .get("/rest/tenant/{tenantId}/skill/", 2937)
                            .accept(MediaType.APPLICATION_JSON))
                .andDo(mvcResult -> logger.info(mvcResult.toString()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.*").value("[{\"id\":2941,\"tenantId\":2937,\"version\":0" +
        ",\"name\":\"Electrical\"},{\"id\":2940,\"tenantId\":2937,\"version\":0,\"name\":\"Mechanical\"}]"));
    }
}
