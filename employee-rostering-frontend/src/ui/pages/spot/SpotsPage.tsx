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

import * as React from 'react';
import {DataTable, DataTableProps} from 'ui/components/DataTable';
import MultiTypeaheadSelectInput from 'ui/components/MultiTypeaheadSelectInput'
import {spotOperations} from 'store/spot';
import Spot from 'domain/Spot';
import { AppState } from 'store/types';
import { TextInput, Text } from '@patternfly/react-core';
import { connect } from 'react-redux';
import Skill from 'domain/Skill';

export interface SpotComponents {
  name: string;
  requiredSkillSet: Skill[];
}

interface StateProps extends DataTableProps<Spot,SpotComponents> {
  tenantId: number;
  skillList: Skill[];
}

const mapStateToProps = ({ tenantData, skillList, spotList }: AppState): StateProps => ({
  title: "Spots",
  columnTitles: ["Name", "Required Skill Set"],
  tableData: spotList.spotList,
  skillList: skillList.skillList,
  tenantId: tenantData.currentTenantId
}); 

export interface DispatchProps {
  addSpot: typeof spotOperations.addSpot;
  updateSpot: typeof spotOperations.updateSpot;
  removeSpot: typeof spotOperations.removeSpot;
}

const mapDispatchToProps: DispatchProps = {
  addSpot: spotOperations.addSpot,
  updateSpot: spotOperations.updateSpot,
  removeSpot: spotOperations.removeSpot
};

export type Props = StateProps & DispatchProps;

export class SpotsPage extends DataTable<Spot,SpotComponents, Props> {
  constructor(props: Props) {
    super(props);
    this.extractDataFromRow = this.extractDataFromRow.bind(this);
    this.addData = this.addData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeData = this.removeData.bind(this);
  }

  displayDataRow(data: Spot): JSX.Element[] {
    return [
      <Text key={0}>{data.name}</Text>,
      <Text key={1}>{data.requiredSkillSet.reduce((prev, skill) => 
        (prev.length === 0)? skill.name : prev + "," + skill.name,
        "")}</Text>
    ];
  }

  createNewDataRow(dataStore: SpotComponents): JSX.Element[] {
    dataStore.name = "";
    dataStore.requiredSkillSet = []
    return [
      <TextInput key={0} name="name"
        aria-label="Name"
        onChange={(value) => dataStore.name = value}
      />,
      <MultiTypeaheadSelectInput key={1}
        emptyText={"Select required skills"}
        options={this.props.skillList}
        optionToStringMap={skill => skill.name}
        defaultValue={[]}
        onChange={selected => dataStore.requiredSkillSet = selected}
      />
    ];
  }
  
  editDataRow(dataStore: SpotComponents, data: Spot): JSX.Element[] {
    dataStore.name = data.name;
    dataStore.requiredSkillSet = data.requiredSkillSet;
    return [
      <TextInput key={0}
        name="name"
        defaultValue={data.name}
        aria-label="Name"
        onChange={(value) => dataStore.name = value}
      />,
      <MultiTypeaheadSelectInput key={1}
        emptyText={"Select required skills"}
        options={this.props.skillList}
        optionToStringMap={skill => skill.name}
        defaultValue={data.requiredSkillSet}
        onChange={selected => dataStore.requiredSkillSet = selected}
      />
    ];
  }
  
  isValid(editedValue: SpotComponents): boolean {
    return editedValue.name.length > 0;
  }
  
  extractDataFromRow(oldValue: Spot|{}, editedValue: SpotComponents): Spot {
    return {...oldValue,
      name: editedValue.name,
      requiredSkillSet: editedValue.requiredSkillSet,
      tenantId: this.props.tenantId
    };
  }

  updateData(data: Spot): void {
    this.props.updateSpot(data);
  }
  
  addData(data: Spot): void {
    this.props.addSpot(data);
  }

  removeData(data: Spot): void {
    this.props.removeSpot(data);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpotsPage);