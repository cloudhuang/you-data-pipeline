import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, Settings, Box } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

const dataSourceTypes = [
  { value: 'database', label: '数据库', icon: Database },
  { value: 'api', label: 'API', icon: Box },
  { value: 'file', label: '文件', icon: FileText },
  { value: 'other', label: '其他', icon: Settings },
];

export default function DataSourceConfigurator() {
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [currentSource, setCurrentSource] = useState<DataSource>({
    id: '',
    name: '',
    type: 'database',
    config: {},
  });

  const handleAddSource = () => {
    if (currentSource.name && currentSource.type) {
      const newSource = { ...currentSource, id: Date.now().toString() };
      setDataSources([...dataSources, newSource]);
      setCurrentSource({ id: '', name: '', type: 'database', config: {} });
      setActiveSourceId(null);
    }
  };

  const handleEditSource = (source: DataSource) => {
    setCurrentSource(source);
    setActiveSourceId(source.id);
  };

  const handleDeleteSource = (id: string) => {
    setDataSources(dataSources.filter(source => source.id !== id));
    setActiveSourceId(null);
  };

  const handleConfigChange = (key: string, value: any) => {
    setCurrentSource(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  };

  const renderConfigFields = () => {
    const typeInfo = dataSourceTypes.find(t => t.value === currentSource.type);

    switch (currentSource.type) {
      case 'database':
        return (
          <>
            <div className="space-y-2">
              <label>主机</label>
              <Input
                value={currentSource.config.host || ''}
                onChange={e => handleConfigChange('host', e.target.value)}
                placeholder="数据库主机"
              />
            </div>
            <div className="space-y-2">
              <label>端口</label>
              <Input
                value={currentSource.config.port || ''}
                onChange={e => handleConfigChange('port', e.target.value)}
                placeholder="数据库端口"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label>数据库名称</label>
              <Input
                value={currentSource.config.database || ''}
                onChange={e => handleConfigChange('database', e.target.value)}
                placeholder="数据库名称"
              />
            </div>
            <div className="space-y-2">
              <label>用户名</label>
              <Input
                value={currentSource.config.username || ''}
                onChange={e => handleConfigChange('username', e.target.value)}
                placeholder="数据库用户名"
              />
            </div>
            <div className="space-y-2">
              <label>密码</label>
              <Input
                value={currentSource.config.password || ''}
                onChange={e => handleConfigChange('password', e.target.value)}
                placeholder="数据库密码"
                type="password"
              />
            </div>
          </>
        );

      case 'api':
        return (
          <>
            <div className="space-y-2">
              <label>API URL</label>
              <Input
                value={currentSource.config.url || ''}
                onChange={e => handleConfigChange('url', e.target.value)}
                placeholder="API URL"
              />
            </div>
            <div className="space-y-2">
              <label>认证类型</label>
              <Select
                value={currentSource.config.authType || 'none'}
                onValueChange={value => handleConfigChange('authType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择认证类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  <SelectItem value="apiKey">API Key</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {currentSource.config.authType === 'apiKey' && (
              <div className="space-y-2">
                <label>API Key</label>
                <Input
                  value={currentSource.config.apiKey || ''}
                  onChange={e => handleConfigChange('apiKey', e.target.value)}
                  placeholder="API Key"
                />
              </div>
            )}
          </>
        );

      case 'file':
        return (
          <>
            <div className="space-y-2">
              <label>文件路径</label>
              <Input
                value={currentSource.config.path || ''}
                onChange={e => handleConfigChange('path', e.target.value)}
                placeholder="文件路径"
              />
            </div>
            <div className="space-y-2">
              <label>文件格式</label>
              <Select
                value={currentSource.config.format || 'json'}
                onValueChange={value => handleConfigChange('format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择文件格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'other':
        return (
          <>
            <div className="space-y-2">
              <label>自定义配置</label>
              <Input
                value={currentSource.config.custom || ''}
                onChange={e => handleConfigChange('custom', e.target.value)}
                placeholder="自定义配置"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据源配置</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 bg-white p-4">
          <h2 className="text-xl font-bold mb-4">已配置数据源</h2>
          <ul>
            {dataSources.map(source => (
              <li key={source.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded">
                <div>
                  <span className="font-semibold">{source.name}</span> ({source.type})
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditSource(source)}>
                    编辑
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSource(source.id)}>
                    删除
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>{activeSourceId === null ? '新建数据源' : '编辑数据源'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label>数据源名称</label>
                  <Input
                    value={currentSource.name}
                    onChange={e => setCurrentSource(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="数据源名称"
                  />
                </div>
                <div className="space-y-2">
                  <label>数据源类型</label>
                  <Select
                    value={currentSource.type}
                    onValueChange={value => setCurrentSource(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择数据源类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSourceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderConfigFields()}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setCurrentSource({ id: '', name: '', type: 'database', config: {} })}>
                    重置
                  </Button>
                  <Button onClick={handleAddSource}>
                    {activeSourceId === null ? '添加数据源' : '保存更改'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}