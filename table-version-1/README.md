# Byzzer Custom Table Visualization 

## Installation: 

### Prerequisites: 
    
- [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/)

### Clone this repo and install with:

- ```yarn install```

### Build the project:

- ```yarn build```


### From Looker, add a `visualization` parameter to your project's `manifest.lkml` file:

```
visualization: {
  id: "byzzer_visualization"
  label: "Byzzer Table"
  file: "byzzer_table.js"
}
```

Copy the file generated during the build, `dist/byzzer_table.js`, to the Looker project. 


Looker custom visualization ref:
- https://github.com/looker/custom_visualizations_v2/blob/master/docs/getting_started.md
- https://github.com/looker/custom_visualizations_v2
- https://cloud.google.com/looker/docs/reference/param-manifest-visualization

---
## Usage:

### Automatically exclude columns from the Byzzer Table based on filter values

- The Byzzer Table allows for columns to be automatically hidden based on filter values.  
  - Unpopulated filters will cause those related columns to be removed from the visualization. 

To enable this, a dimension must be created that contains the column names to be hidden.  This dimension must be a string type and must be named `columns_to_hide`.  The values of this dimension must be a comma separated list of column names to be hidden.  The column names must match the column names in the view.

To create this dimension, add similar logic as shown below to your view's `explore` block:

```
dimension: columns_to_hide {
    type: string
    sql:
    CONCAT(
    {% if feature_1._is_filtered or custom_char_base.char_id_1._is_filtered  or dynamic_product_feat_base.select_product_feature_1._is_filtered %}
      ''
    {% else %}
      'base_view.dynamic_product_dimension_1'
    {% endif %}

    {% if feature_2._is_filtered or custom_char_base.char_id_2._is_filtered or dynamic_product_feat_base.select_product_feature_2._is_filtered %}
      ,''
    {% else %}
      ,', base_view.dynamic_product_dimension_2'
    {% endif %}

...

```

## Cosmetic - Typography  

### Column Sizes
  - Variable *defaultColumn* in CustomTable.js is used to set:
    - minWidth
    - maxWidth
    - width (default)

### Fonts
  - Current font [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) is set through an @import in *CustomTable.js* and in various CSS styles in the same file.

  - Table Header size, color, and other table elements are set through CSS defined in *CustomTable.js* and in the *styles* object in the same file.
  







