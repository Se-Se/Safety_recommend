export const systemOption: any = [
  { value: '第三方系统', text: '第三方系统' },
  { value: '内部系统', text: '内部系统' },
];

export const systemKOptions: any = [
  { value: 'all', text: '所以类型' },
  { value: '第三方系统', text: '第三方系统' },
  { value: '内部系统', text: '内部系统' },
];

export const systemOrPropertyOption: any = [
  { value: 'all', text: '所有分类' },
  { value: 'system', text: '系统' },
  { value: 'property', text: '资产' },
];
export const levelOptions: any = [
  { value: 'low', text: '低风险' },
  { value: 'mid', text: '中风险' },
  { value: 'high', text: '高风险' },
];

export const propertyOption: any = [
  {
    label: '网络',
    value: '网络',
    children: [
      { label: '交换机', value: '交换机' },
      { label: '路由器', value: '路由器' },
      { label: '防火墙', value: '防火墙' },
      { label: '堡垒机', value: '堡垒机' },
      { label: 'IPS', value: 'IPS' },
      { label: 'IDS', value: 'IDS' },
    ],
  },
  {
    label: '客户端',
    value: '客户端',
    children: [
      { label: '浏览器', value: '浏览器' },
      { label: '手机', value: '手机' },
      { label: 'PC终端', value: 'PC终端' },
      { label: 'PDA手持设备', value: 'PDA手持设备' },
      { label: 'ATM终端', value: 'ATM终端' },
    ],
  },
  {
    label: '服务器',
    value: '服务器',
    children: [
      { label: 'web服务器', value: 'web服务器' },
      { label: '邮件服务器', value: '邮件服务器' },
      { label: '应用服务器', value: '应用服务器' },
      { label: '应用服务器集群', value: '应用服务器集群' },
    ],
  },
  {
    label: '数据存储',
    value: '数据存储',
    children: [
      { label: '数据仓库', value: '数据仓库' },
      { label: '关系型数据库', value: '关系型数据库' },
      { label: 'NoSql数据库', value: 'NoSql数据库' },
      { label: '文件数据库', value: '文件数据库' },
    ],
  },
];

export const attackOption: any = [
  { value: 'diy', text: '其他' },
  { value: 'attack_1', text: '攻击手法1' },
  { value: 'attack_2', text: '攻击手法2' },
];
export const bugsOption: any = [
  { value: 'diy', text: '其他' },
  { value: 'bug_1', text: '漏洞1' },
  { value: 'bug_2', text: '漏洞2' },
];

export const actionOption: any = [
  { value: 'diy', text: '其他' },
  { value: 'act_1', text: '执行动作1' },
  { value: 'act_2', text: '执行动作2' },
];

export const againstOption: any = [
  { value: 'diy', text: '其他' },
  { value: 'against_1', text: '对抗措施1' },
  { value: 'against_2', text: '对抗措施2' },
];

export const areaOptions: any = [
  { text: '分区名称1', value: 'area_1' },
  { text: '分区名称2', value: 'area_2' },
  { text: '分区名称3', value: 'area_3' },
  { text: '分区名称4', value: 'area_4' },
];
