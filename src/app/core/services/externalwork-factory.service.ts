import { Injectable } from '@angular/core';

import {WorkType} from '../domain/work'
import {NumberInput, TextInput, DisabledInput, 
        TreeWorkNode,  TreeWorkFlatNode, IWorkFactoryService} from '../domain/common'

@Injectable()
export class ExternalWorkFactoryService implements IWorkFactoryService {

  public static readonly quantity_id = 'qty'
  public static readonly unitary_price_id = 'unitaryPrice'
  public static readonly charge_perc_id = 'PercRic'
  public static readonly tot_price_id = 'totPrice'

  _createSingleInputFrom(nInput : NumberInput) {
    var result = new TreeWorkNode();
    result.inputs = [nInput]
    result.name = nInput.label
    result.isSingleNode = true
    result.canAddLevel = false
    return result
  }  

  _createSingleInput(name: string, value: number) {
    var result = new TreeWorkNode();
    var sIn = new NumberInput(name, value)
    result.inputs = [sIn]
    result.name = name
    result.isSingleNode = true
    result.canAddLevel = false
    return result
  }

  _createExternalWorkNode(wTypeString : string) : TreeWorkNode {
    const result = new TreeWorkNode(calculateExtWork)
    //servono per gli if di interfaccia
    result.inputs.push(new NumberInput(ExternalWorkFactoryService.quantity_id, 0))
    result.inputs.push(new NumberInput(ExternalWorkFactoryService.unitary_price_id, 0))
    result.inputs.push(new NumberInput(ExternalWorkFactoryService.charge_perc_id, 0))
    result.outputs = [
      new TextInput(ExternalWorkFactoryService.tot_price_id, "0")
    ]
    result.children = result.inputs.map(i => this._createSingleInputFrom(i))
    result.name = wTypeString
    result.canAddLevel = false
    result.isWork = true
    return result

    

    function calculateExtWork(treeWorkNode : TreeWorkNode) {
        
        //se non ci sono stage validi si comporta come una lavorazione esterna
        var totPriceOutput = treeWorkNode.outputs[0]

        var quantita = result.inputs[0].value
        var pUnitario = result.inputs[1].value
        var ricarico = result.inputs[2].value

        totPriceOutput.text = ((quantita * pUnitario) * (100+ricarico)/100).toFixed(2)
    }
  }
  //si possono specificare per ogni lavorazione estrna unità di misura e prezzo unitario
  //gli enum sono solo "da fuori" a me interessa solo il tipo
  createWork(wTypeString : string) {
    return this._createExternalWorkNode(wTypeString)
  }
  
  createStageForWork(wTypeString : string, stageName: string) : TreeWorkNode{
    return this._createExternalWorkNode(stageName)
  }

  fixChildrens(node : TreeWorkNode) {

  }

  restoreChildrens(node : TreeWorkNode) {

  }

  //mai chiamato, non ci sono stage, in questa modalitò ci sono solo elementi di primo livello
  createDefaultChildrenNode() {
    return null
  }
}