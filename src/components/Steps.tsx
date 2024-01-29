import React, { FC, useState } from 'react'

interface FormType {trainingDate: string, trainingSteps: number};

function dateToDMY (dateISO: string) {
  if (dateISO) {
    const arr =dateISO.split('-');
    return arr[2] + '.' + arr[1] + '.' + arr[0];
  } else
    return '';
}

export const Steps: FC = () => {
  const [form, setForm] = useState<FormType>({ trainingDate: '', trainingSteps: 0 });
  const [hist, setHistory] = useState<FormType[]>([]);
  let trainingHistory: FormType[] = [];

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const {name, value} = e.target;
    
    if (name == 'trainingSteps' && value.match(/^\d+$/)) {
      setForm({...form, [name]: value});
    }
    else if (name =='trainingDate' && value.match(/^[0-3][0-9]\.[0-1][0-9]\.[0-9][0-9]$/i)) {
      const dateISO = '20' + value.split('.').reverse().join('-');
      setForm({...form, [name]: dateISO});
    } else
      setForm({...form, [name]: null});
  } 

  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    trainingHistory.push(form);

    if (form.trainingDate && form.trainingSteps) {
      
      if (hist.findIndex((elem) => elem.trainingDate === form.trainingDate) > -1) {
        const arr = hist.map((elem) => {
          return (
            (elem.trainingDate === form.trainingDate) ? 
              {
                trainingDate: elem.trainingDate, 
                trainingSteps: (+elem.trainingSteps) + (+form.trainingSteps)
              } : 
              {
                trainingDate: elem.trainingDate, 
                trainingSteps: elem.trainingSteps
              }
          )} 
        );

        setHistory(arr);
      } else {
        let insertAfter = hist.findIndex((elem) => elem.trainingDate > form.trainingDate);
        insertAfter = insertAfter == -1 ? hist.length : insertAfter;
        const arr = [...hist.slice(0, insertAfter), form, ...hist.slice(insertAfter)];

        setHistory(arr);
      }
    }
  };

  const delAction = (selDate) => {
    let idx = hist.findIndex((elem) => elem.trainingDate == selDate);
    const arr = [...hist.slice(0, idx), ...hist.slice(idx + 1)];
    setHistory(arr);
  }

  const editAction = (selDate) => {
    let idx = hist.findIndex((elem) => elem.trainingDate == selDate);
    const editData: FormType = {trainingDate: hist[idx].trainingDate, trainingSteps: hist[idx].trainingSteps}
    setForm(editData);
  }

  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <div className="form">
          <div>
            <label htmlFor="trainingDate">Дата (ДД.ММ.ГГ)</label>
            <input
              type="text"
              id="trainingDate"
              name="trainingDate"
              //value={form.trainingDate}
              onChange = {(e) => handleInputChange(e)}
            />
          </div>
          <div>
            <label htmlFor="trainingSteps">Пройдено км</label>
            <input
              type="text"
              id="trainingSteps"
              name="trainingSteps"
              //value={form.trainingSteps}
              onChange = {(e) => handleInputChange(e)}
            />
          </div>
          <div>
            <button type="submit">ОК</button>
          </div>
        </div>
      </form>
      <div className="hist">
        <ul>
          <li>
            <span className="col">Дата (ДД.ММ.ГГ)</span>
            <span className="col">Пройдено км</span> 
            <span className="col">Действия</span>
          </li>
          {hist.map((elem, idx) => (
            <li key={idx}>
              <span className="col">{elem.trainingDate.split('-').reverse().join('.')}</span>
              <span className="col">{elem.trainingSteps}</span> 
              <span className="col">
                <span className="del" onClick={() => delAction(elem.trainingDate)}>&#10008;</span>
                <span className="edit" onClick={() => editAction(elem.trainingDate)}>E</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
