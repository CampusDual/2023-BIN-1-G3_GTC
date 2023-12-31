import { Component, OnInit, ViewChild } from "@angular/core";
import { OTableComponent, OTranslateService } from "ontimize-web-ngx";
import { Subscription } from "rxjs";
import { FilterExpressionUtils, Expression } from "ontimize-web-ngx";
import * as XLSX from "xlsx";
// import { ComboTruck, enumTruck } from "src/app/shared/combotruck.service";
import { Enum, enumTruck } from "src/app/shared/enum";

@Component({
  selector: "app-trucks-home",
  templateUrl: "./trucks-home.component.html",
  styleUrls: ["./trucks-home.component.css"],
  providers: [Enum],
})
export class TrucksHomeComponent implements OnInit {
  private translateServiceSubscription: Subscription;
  public array: Object[];

  constructor(private translate: OTranslateService, private combo: Enum) {
    this.array = [
      {
        key: enumTruck.Todos,
        value: "All",
      },
      {
        key: enumTruck.Articulado,
        value: "Articulado",
      },
      {
        key: enumTruck.No_articulado,
        value: "No Articulado",
      },
    ];
  }

  public ngOnDestroy(): void {
    if (this.translateServiceSubscription) {
      this.translateServiceSubscription.unsubscribe();
    }
  }

  public getDataArray(): any[] {
    return this.array;
  }

  public getValueSimple(): any {
    return 0;
  }

  ngOnInit() {}
  createFilter(values: Array<{ attr; value }>): Expression {
    // Prepare simple expressions from the filter components values
    let filters: Array<Expression> = [];
    values.forEach((fil) => {
      if (fil.attr === "checkTruck") {
        if (fil.value === enumTruck.Articulado) {
          filters.push(
            FilterExpressionUtils.buildExpressionEquals("type_of_truck", 0)
          );
        }

        if (fil.value === enumTruck.No_articulado) {
          if (fil.attr === "checkTruck") {
            filters.push(
              FilterExpressionUtils.buildExpressionEquals("type_of_truck", 1)
            );
          }
        }
      }
    });

    // Build complex expression
    if (filters.length > 0) {
      return filters[0];
    } else {
      return null;
    }
  }

  @ViewChild("truckTable", { static: false }) truckTable: OTableComponent;

  exportExcel() {
    let data = this.truckTable.getAllValues();

    // data.forEach((fil) => {
    //   let translate_to = fil["type_of_truck"] === 0 ? "Yes" : "No";
    //   fil["checkTruck"] = this.translate.get(translate_to);

    //   delete fil["type_of_truck"];
    //   delete fil["id_truck"];
    // });

    let cols_to_del = ["type_of_truck", "id_truck"];
    let excel_data = data.map((fil) => {
      let ret = {};
      for (let key of Object.keys(fil)) {
        if (cols_to_del.includes(key)) continue;
        ret[key] = fil[key];
      }
      ret["checkTruck"] = this.translate.get(
        fil["type_of_truck"] === 0 ? "Yes" : "No"
      );
      return ret;
    });

    // const updatedArray = data.map(({ ["id_truck"]: _, ...rest }) => rest);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excel_data);
    ws["!cols"] = [];
    Object.keys(data[0]).forEach((cell: any) => {
      const colWidth = 145;
      ws["!cols"].push({
        wpx: colWidth,
      });
    });

    // ws['!cols'][7] = { hidden: true };
    ws["A1"]["v"] = this.translate.get("viajes_completados");
    ws["B1"]["v"] = this.translate.get("total_carga");
    ws["C1"]["v"] = this.translate.get("viajes_carga");
    ws["D1"]["v"] = this.translate.get("viajes_descarga");
    ws["E1"]["v"] = this.translate.get("total_cargado");
    ws["F1"]["v"] = this.translate.get("total_descargado");
    ws["G1"]["v"] = this.translate.get("plate");
    ws["H1"]["v"] = this.translate.get("checkTruck");

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trucks");

    const date = new Date();
    const name = this.translate.get("TRUCKS");
    const format = date
      .toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    const namewithdate = `${format}_${name}.xlsx`;

    /* save to file */
    XLSX.writeFile(wb, namewithdate, { cellStyles: true });
  }
}
